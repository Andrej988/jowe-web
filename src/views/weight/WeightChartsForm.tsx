import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import WeightMeasurementChart from 'src/components/weight/WeightMeasurementChart';
import WeightMeasurementsDetailedChart from 'src/components/weight/WeightMeasurementsDetailedChart';

import type { Measurement, SimpleMeasurements } from 'src/model/weight/Measurements';
import WeightMeasurementsService from 'src/services/weight/WeightMeasurementsService';

const WeightChartsForm: React.FC = () => {
  const [bodyFatMeasurements, setBodyFatMeasurements] = useState<SimpleMeasurements>([]);
  const [waterMeasurements, setWaterMeasurements] = useState<SimpleMeasurements>([]);
  const [muscleMassMeasurements, setMuscleMassMeasurements] = useState<SimpleMeasurements>([]);
  const [boneMassMeasurements, setBoneMassMeasurements] = useState<SimpleMeasurements>([]);
  const [energyMeasurements, setEnergyMeasurements] = useState<SimpleMeasurements>([]);

  const isFetched: boolean = useSelector((state: any) => state.weight.isFetched);
  const measurementsState = useSelector((state: any) => state.weight.measurements);

  useEffect(() => {
    const measurements: Measurement[] = measurementsState
      .slice()
      .sort((a: any, b: any) => b.date - a.date)
      .reverse();

    setBodyFatMeasurements(
      measurements
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

    setWaterMeasurements(
      measurements
        .slice()
        .filter((x) => x.measurements.waterPercentage !== undefined)
        .map((x) => {
          return {
            id: x.measurementId,
            date: x.date,
            measurement: Number(x.measurements.waterPercentage),
          };
        }),
    );

    setMuscleMassMeasurements(
      measurements
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

    setBoneMassMeasurements(
      measurements
        .slice()
        .filter((x) => x.measurements.bonePercentage !== undefined)
        .map((x) => {
          return {
            id: x.measurementId,
            date: x.date,
            measurement: Number(x.measurements.bonePercentage),
          };
        }),
    );

    setEnergyMeasurements(
      measurements
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
      <WeightMeasurementsDetailedChart title="Weight" />
      {bodyFatMeasurements.length > 1 && (
        <WeightMeasurementChart
          title="Body Fat"
          label="Body Fat %"
          measurements={bodyFatMeasurements}
        />
      )}
      {waterMeasurements.length > 1 && (
        <WeightMeasurementChart
          title="Body Water"
          label="Body Water %"
          measurements={waterMeasurements}
        />
      )}
      {muscleMassMeasurements.length > 1 && (
        <WeightMeasurementChart
          title="Muscle Mass"
          label="Muscle Mass %"
          measurements={muscleMassMeasurements}
        />
      )}
      {boneMassMeasurements.length > 1 && (
        <WeightMeasurementChart
          title="Bone Mass"
          label="Bone Mass %"
          measurements={boneMassMeasurements}
        />
      )}
      {energyMeasurements.length > 1 && (
        <WeightMeasurementChart
          title="Energy Expenditure"
          label="Energy Expenditure"
          measurements={energyMeasurements}
        />
      )}
    </Fragment>
  );
};

export default WeightChartsForm;
