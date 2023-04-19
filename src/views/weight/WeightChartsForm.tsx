import React, { Fragment } from 'react';
import WeightMeasurementChart from 'src/components/weight/WeightMeasurementChart';
import WeightMeasurementsDetailedChart from 'src/components/weight/WeightMeasurementsDetailedChart';

import { getTestMeasurements } from 'src/model/TestMeasurements';
// TODO: Remove??
/* import AuthService from 'src/security/AuthService';
import { SERVICE_URL } from 'src/config/ServiceConfig';
import axios from 'axios'; */

const sampleData = getTestMeasurements();

const measurementsSortedByLatestDate = sampleData.measurements
  .slice()
  .sort((a: any, b: any) => b.date - a.date);

const WeightChartsForm: React.FC = () => {
  // TODO: Remove??
  /* console.log('accesstoken', AuthService.getAccessToken());
  const config = {
    headers: {
      Authorization: AuthService.getAccessToken(),
    },
  };

  axios
    .get(SERVICE_URL, config)
    .then((response) => {
      console.log('Success', response);
    })
    .catch((err) => {
      console.log('failed', err);
    }); */

  return (
    <Fragment>
      <WeightMeasurementsDetailedChart
        title="Weight"
        targetWeight={100}
        measurements={measurementsSortedByLatestDate
          .slice()
          .reverse()
          .map((x) => {
            return {
              id: x.measurementId,
              date: x.date,
              measurement: x.measurements.weight,
            };
          })}
      />
      <WeightMeasurementChart
        title="Body Fat"
        label="Body Fat %"
        measurements={measurementsSortedByLatestDate
          .slice()
          .reverse()
          .map((x) => {
            return {
              id: x.measurementId,
              date: x.date,
              measurement: x.measurements.bodyFatPercentage,
            };
          })}
      />
      <WeightMeasurementChart
        title="Body Water"
        label="Body Water %"
        measurements={measurementsSortedByLatestDate
          .slice()
          .reverse()
          .map((x) => {
            return {
              id: x.measurementId,
              date: x.date,
              measurement: x.measurements.waterPercentage,
            };
          })}
      />
      <WeightMeasurementChart
        title="Muscle Mass"
        label="Muscle Mass %"
        measurements={measurementsSortedByLatestDate
          .slice()
          .reverse()
          .map((x) => {
            return {
              id: x.measurementId,
              date: x.date,
              measurement: x.measurements.muscleMassPercentage,
            };
          })}
      />
      <WeightMeasurementChart
        title="Bone Mass"
        label="Bone Mass %"
        measurements={measurementsSortedByLatestDate
          .slice()
          .reverse()
          .map((x) => {
            return {
              id: x.measurementId,
              date: x.date,
              measurement: x.measurements.bonePercentage,
            };
          })}
      />
      <WeightMeasurementChart
        title="Energy Expenditure"
        label="Energy Expenditure"
        measurements={measurementsSortedByLatestDate
          .slice()
          .reverse()
          .map((x) => {
            return {
              id: x.measurementId,
              date: x.date,
              measurement: x.measurements.energyExpenditure,
            };
          })}
      />
    </Fragment>
  );
};

export default WeightChartsForm;
