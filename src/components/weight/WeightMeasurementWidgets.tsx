import React, { useEffect, useState } from 'react';
import { CRow } from '@coreui/react';
import MeasurementWidget from './WeightMeasurementWidget';
import type { Measurement, SimpleMeasurements } from 'src/model/weight/Measurement';

interface Props {
  measurements: Measurement[];
}

const WeightMeasurementWidgets: React.FC<Props> = (props) => {
  const [weightMeasurmeents, setWeightMeasurements] = useState<SimpleMeasurements>([]);
  const [bodyFatMeasurmeents, setBodyFatMeasurements] = useState<SimpleMeasurements>([]);
  const [muscleMassMeasurmeents, setMuscleMassMeasurements] = useState<SimpleMeasurements>([]);
  const [energyMeasurmeents, setEnergyMeasurements] = useState<SimpleMeasurements>([]);

  useEffect(() => {
    const measurementsSortedByDate = props.measurements.slice().reverse();

    setWeightMeasurements(
      measurementsSortedByDate.slice().map((x) => {
        return { id: x.measurementId, date: x.date, measurement: x.measurements.weight };
      }),
    );

    setBodyFatMeasurements(
      measurementsSortedByDate
        .slice()
        .filter((x) => x.measurements.bodyFatPercentage !== undefined)
        .map((x) => {
          return {
            id: x.measurementId,
            date: x.date,
            measurement: Number(x.measurements.bodyFatPercentage),
          };
        }),
    );

    setMuscleMassMeasurements(
      measurementsSortedByDate
        .slice()
        .filter((x) => x.measurements.muscleMassPercentage !== undefined)
        .map((x) => {
          return {
            id: x.measurementId,
            date: x.date,
            measurement: Number(x.measurements.muscleMassPercentage),
          };
        }),
    );

    setEnergyMeasurements(
      measurementsSortedByDate
        .slice()
        .filter((x) => x.measurements.energyExpenditure !== undefined)
        .map((x) => {
          return {
            id: x.measurementId,
            date: x.date,
            measurement: Number(x.measurements.energyExpenditure),
          };
        }),
    );
  }, [props.measurements]);

  return (
    <CRow>
      <MeasurementWidget
        color="info"
        title="Weight"
        unit="kg"
        pointStyle="--cui-info"
        measurements={weightMeasurmeents}
      />
      <MeasurementWidget
        color="warning"
        title="Body Fat"
        unit="%"
        pointStyle="--cui-warning"
        measurements={bodyFatMeasurmeents}
      />
      <MeasurementWidget
        color="success"
        title="Muscle Mass"
        unit="%"
        pointStyle="--cui-success"
        measurements={muscleMassMeasurmeents}
      />
      <MeasurementWidget
        color="danger"
        title="Energy Expenditure"
        unit="kcal"
        pointStyle="--cui-danger"
        measurements={energyMeasurmeents}
      />
    </CRow>
  );
};

export default WeightMeasurementWidgets;
