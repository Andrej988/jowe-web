import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import WeightMeasurementHistory from 'src/components/weight/WeightMeasurementHistory';

import type { UIWeightMeasurement } from 'src/model/weight/UIWeightMeasurements';
import WeightMeasurementsService from 'src/services/weight/WeightMeasurementsService';
import { ReduxStoreState } from 'src/store/Store';

const WeightMeasurementsForm: React.FC = () => {
  const [measurements, setMeasurements] = useState<UIWeightMeasurement[]>([]);
  const isFetched: boolean = useSelector(
    (state: ReduxStoreState) => state.weight.isFetchedMeasurements,
  );
  const measurementsState = useSelector((state: ReduxStoreState) => state.weight.measurements);

  useEffect(() => {
    setMeasurements(
      measurementsState
        .slice()
        .sort(
          (a: UIWeightMeasurement, b: UIWeightMeasurement) => b.date.valueOf() - a.date.valueOf(),
        ),
    );
  }, [measurementsState]);

  useEffect(() => {
    if (!isFetched) {
      WeightMeasurementsService.getInstance()
        .retrieveMeasurements()
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [isFetched]);

  return (
    <Fragment>
      <WeightMeasurementHistory
        title="History of Measurements"
        items={measurements.slice()}
        showDetailsButton={true}
        showEditButton={true}
        showDeleteButton={true}
      />
    </Fragment>
  );
};

export default WeightMeasurementsForm;
