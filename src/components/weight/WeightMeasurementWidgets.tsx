import React from 'react';
import { CRow } from '@coreui/react';
import MeasurementWidget from './WeightMeasurementWidget';
import type { Measurement } from 'src/model/Measurement';

interface Props {
  measurements: Measurement[];
}

const WeightMeasurementWidgets: React.FC<Props> = (props) => {
  const measurementsSortedByDate = props.measurements.slice().reverse();

  return (
    <CRow>
      <MeasurementWidget
        color="info"
        title="Weight"
        unit="kg"
        pointStyle="--cui-info"
        measurements={measurementsSortedByDate.slice().map((x) => {
          return { id: x.measurementId, date: x.date, measurement: x.measurements.weight };
        })}
      />
      <MeasurementWidget
        color="warning"
        title="Body Fat"
        unit="%"
        pointStyle="--cui-warning"
        measurements={measurementsSortedByDate.slice().map((x) => {
          return {
            id: x.measurementId,
            date: x.date,
            measurement: x.measurements.bodyFatPercentage,
          };
        })}
      />
      <MeasurementWidget
        color="success"
        title="Muscle Mass"
        unit="%"
        pointStyle="--cui-success"
        measurements={measurementsSortedByDate.slice().map((x) => {
          return {
            id: x.measurementId,
            date: x.date,
            measurement: x.measurements.muscleMassPercentage,
          };
        })}
      />
      <MeasurementWidget
        color="danger"
        title="Energy Expenditure"
        unit="kcal"
        pointStyle="--cui-danger"
        measurements={measurementsSortedByDate.slice().map((x) => {
          return {
            id: x.measurementId,
            date: x.date,
            measurement: x.measurements.energyExpenditure,
          };
        })}
      />
    </CRow>
  );
};

export default WeightMeasurementWidgets;
