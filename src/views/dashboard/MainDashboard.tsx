import React from 'react';

import MeasurementWidgets from './MeasurementWidgets';
import MeasurementHistory from './MeasurementHistory';
import MeasurementChart from './MeasurementChart';
import { getTestMeasurements } from 'src/model/TestMeasurements';
import AuthService from 'src/security/AuthService';
import { SERVICE_URL } from 'src/config/ServiceConfig';
import axios from 'axios';

const sampleData = getTestMeasurements();

const measurementsSortedByLatestDate = sampleData.measurements
  .slice()
  .sort((a: any, b: any) => b.date - a.date);

const MainDashboard: React.FC<{}> = () => {
  /*console.log('accesstoken', AuthService.getAccessToken());
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
    });*/

  return (
    <>
      <MeasurementWidgets measurements={measurementsSortedByLatestDate.slice(0, 10)} />
      <MeasurementChart
        title="Weight"
        subtitle=""
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
      <MeasurementHistory measurements={measurementsSortedByLatestDate.slice()} />
    </>
  );
};

export default MainDashboard;
