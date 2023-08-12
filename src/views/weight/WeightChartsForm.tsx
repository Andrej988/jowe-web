import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import WeightMeasurementChart from 'src/components/weight/WeightMeasurementChart';
import WeightMeasurementsDetailedChart from 'src/components/weight/WeightMeasurementsDetailedChart';

import type {
  UIWeightMeasurement,
  UISimpleWeightMeasurements,
} from 'src/model/weight/UIWeightMeasurements';
import WeightMeasurementsService from 'src/services/weight/WeightMeasurementsService';
import { ReduxStoreState } from 'src/store/Store';

const WeightChartsForm: React.FC = () => {
  const [bodyFatMeasurements, setBodyFatMeasurements] = useState<UISimpleWeightMeasurements>([]);
  const [waterMeasurements, setWaterMeasurements] = useState<UISimpleWeightMeasurements>([]);
  const [muscleMassMeasurements, setMuscleMassMeasurements] = useState<UISimpleWeightMeasurements>(
    [],
  );
  const [boneMassMeasurements, setBoneMassMeasurements] = useState<UISimpleWeightMeasurements>([]);
  const [energyMeasurements, setEnergyMeasurements] = useState<UISimpleWeightMeasurements>([]);

  const isFetched: boolean = useSelector(
    (state: ReduxStoreState) => state.weight.isFetchedMeasurements,
  );
  const measurementsState = useSelector((state: ReduxStoreState) => state.weight.measurements);

  useEffect(() => {
    const measurements: UIWeightMeasurement[] = measurementsState
      .slice()
      .sort((a: UIWeightMeasurement, b: UIWeightMeasurement) => b.date.valueOf() - a.date.valueOf())
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
