import React, { Fragment, useEffect, useState } from 'react';
import WeightMeasurementChart from 'src/components/weight/WeightMeasurementsDetailedChart';
import WeightMeasurementHistory from 'src/components/weight/WeightMeasurementHistory';
import WeightMeasurementWidgets from 'src/components/weight/WeightMeasurementWidgets';

import WeightMeasurementsService from 'src/services/weight/WeightMeasurementsService';
import { useSelector } from 'react-redux';
import { type Measurement } from 'src/model/weight/Measurement';

const WeightOverviewForm: React.FC = () => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const isFetched: boolean = useSelector((state: any) => state.weight.isFetched);
  const measurementsRedux: Measurement[] = useSelector((state: any) => state.weight.measurements);

  useEffect(() => {
    const measurements: Measurement[] =
      measurementsRedux.length > 0
        ? measurementsRedux.slice().sort((a: any, b: any) => b.date - a.date)
        : measurementsRedux;
    setMeasurements(measurements);
  }, [measurementsRedux]);

  useEffect(() => {
    if (!isFetched) {
      WeightMeasurementsService.getInstance()
        .retrieveMeasurements()
        .catch((err) => {
          // TODO: Toast message?
          console.error(err);
        });
    }
  }, [isFetched]);

  const getMeasurementsSlice = (maxElements?: number): Measurement[] => {
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
      <WeightMeasurementChart
        title="Weight"
        targetWeight={100}
        measurements={getMeasurementsSlice()
          .reverse()
          .map((x) => {
            return {
              id: x.measurementId,
              date: x.date,
              measurement: x.measurements.weight,
            };
          })}
      />
      <WeightMeasurementHistory
        title="Latest Measurements (5)"
        measurements={getMeasurementsSlice(5)}
        showDeleteButton={false}
      />
    </Fragment>
  );
};

export default WeightOverviewForm;
