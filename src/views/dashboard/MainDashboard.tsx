import React, { Fragment } from 'react';
import MeasurementChart from 'src/components/measurements/WeightMeasurementsDetailedChart';
import MeasurementHistory from 'src/components/measurements/MeasurementHistory';
import MeasurementWidgets from 'src/components/measurements/MeasurementWidgets';

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
      <MeasurementWidgets measurements={measurementsSortedByLatestDate.slice(0, 10)} />
      <MeasurementChart
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
      <MeasurementHistory
        title="Latest Measurements (5)"
        measurements={measurementsSortedByLatestDate.slice(0, 5)}
        showDeleteButton={false}
      />
    </Fragment>
  );
};

export default MainDashboard;
