import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import WeightMeasurementHistory from 'src/components/weight/WeightMeasurementHistory';

import type { Measurement } from 'src/model/weight/Measurements';
import WeightMeasurementsService from 'src/services/weight/WeightMeasurementsService';

const WeightMeasurementsForm: React.FC = () => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const isFetched: boolean = useSelector((state: any) => state.weight.isFetched);
  const measurementsState = useSelector((state: any) => state.weight.measurements);

  useEffect(() => {
    setMeasurements(measurementsState.slice().sort((a: any, b: any) => b.date - a.date));
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
        measurements={measurements.slice()}
        showDeleteButton={true}
      />
    </Fragment>
  );
};

export default WeightMeasurementsForm;
