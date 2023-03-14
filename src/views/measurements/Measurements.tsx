import React, { Fragment } from 'react';
import MeasurementHistory from 'src/components/measurements/MeasurementHistory';

import { getTestMeasurements } from 'src/model/TestMeasurements';
/*import AuthService from 'src/security/AuthService';
import { SERVICE_URL } from 'src/config/ServiceConfig';
import axios from 'axios';*/

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
    <Fragment>
      <MeasurementHistory
        title="History of Measurements"
        measurements={measurementsSortedByLatestDate.slice()}
        showDeleteButton={true}
      />
    </Fragment>
  );
};

export default MainDashboard;
