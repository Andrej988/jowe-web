import React, { Fragment } from 'react';
import MeasurementChart from 'src/components/measurements/MeasurementChart';
import WeightMeasurementsDetailedChart from 'src/components/measurements/WeightMeasurementsDetailedChart';

import { getTestMeasurements } from 'src/model/TestMeasurements';
// TODO: Remove??
/* import AuthService from 'src/security/AuthService';
import { SERVICE_URL } from 'src/config/ServiceConfig';
import axios from 'axios'; */

const sampleData = getTestMeasurements();

const measurementsSortedByLatestDate = sampleData.measurements
  .slice()
  .sort((a: any, b: any) => b.date - a.date);

const MainDashboard: React.FC = () => {
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
      <MeasurementChart
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
      <MeasurementChart
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
      <MeasurementChart
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
      <MeasurementChart
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
      <MeasurementChart
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

export default MainDashboard;
