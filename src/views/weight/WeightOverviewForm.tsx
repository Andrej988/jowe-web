import React, { Fragment, useEffect, useState } from 'react';
import WeightMeasurementChart from 'src/components/weight/WeightMeasurementsDetailedChart';
import WeightMeasurementHistory from 'src/components/weight/WeightMeasurementHistory';
import WeightMeasurementWidgets from 'src/components/weight/WeightMeasurementWidgets';

import WeightMeasurementsService from 'src/services/weight/WeightMeasurementsService';
import { useSelector } from 'react-redux';
import { type UIWeightMeasurement } from 'src/model/weight/UIWeightMeasurements';
import WeightTargetsService from 'src/services/weight/WeightTargetsService';

const WeightOverviewForm: React.FC = () => {
  const isAuthenticated: boolean = useSelector((state: any) => state.auth.isAuthenticated);

  const [measurements, setMeasurements] = useState<UIWeightMeasurement[]>([]);
  const isFetchedMeasurements: boolean = useSelector(
    (state: any) => state.weight.isFetchedMeasurements,
  );
  const isFetchedTargetWeights: boolean = useSelector(
    (state: any) => state.weight.isFetchedTargetWeights,
  );
  const measurementsRedux: UIWeightMeasurement[] = useSelector(
    (state: any) => state.weight.measurements,
  );

  useEffect(() => {
    const measurements: UIWeightMeasurement[] =
      measurementsRedux.length > 0
        ? measurementsRedux.slice().sort((a: any, b: any) => b.date - a.date)
        : measurementsRedux;
    setMeasurements(measurements);
  }, [measurementsRedux]);

  useEffect(() => {
    if (!isFetchedMeasurements && isAuthenticated) {
      WeightMeasurementsService.getInstance()
        .retrieveMeasurements()
        .catch((err) => {
          // TODO: Toast message?
          console.error(err);
        });
    }
  }, [isFetchedMeasurements, isAuthenticated]);

  useEffect(() => {
    if (!isFetchedTargetWeights && isAuthenticated) {
      WeightTargetsService.getInstance()
        .retrieveTargetWeights()
        .catch((err) => {
          // TODO: Toast message?
          console.error(err);
        });
    }
  }, [isFetchedTargetWeights, isAuthenticated]);

  const getMeasurementsSlice = (maxElements?: number): UIWeightMeasurement[] => {
    if (measurements.length === 0) {
      return measurements;
    } else {
      return maxElements !== undefined && measurements.length > maxElements
        ? measurements.slice(0, maxElements)
        : measurements.slice();
    }
  };

  return (
    <Fragment>
      <WeightMeasurementWidgets measurements={getMeasurementsSlice(10)} />
      <WeightMeasurementChart title="Weight" />
      <WeightMeasurementHistory
        title="Latest Measurements (5)"
        measurements={getMeasurementsSlice(5)}
        showDeleteButton={false}
      />
    </Fragment>
  );
};

export default WeightOverviewForm;
