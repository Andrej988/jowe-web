import React, { Fragment } from 'react';
import WeightMeasurementChart from 'src/components/weight/WeightMeasurementsDetailedChart';
import WeightMeasurementHistory from 'src/components/weight/WeightMeasurementHistory';
import WeightMeasurementWidgets from 'src/components/weight/WeightMeasurementWidgets';

import { getTestMeasurements } from 'src/model/TestMeasurements';
// TODO: Remove??
/* import AuthService from 'src/security/AuthService';
import { SERVICE_URL } from 'src/config/ServiceConfig';
import axios from 'axios'; */

const sampleData = getTestMeasurements();

const measurementsSortedByLatestDate = sampleData.measurements
  .slice()
  .sort((a: any, b: any) => b.date - a.date);

const WeightOverviewForm: React.FC = () => {
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
      <WeightMeasurementWidgets measurements={measurementsSortedByLatestDate.slice(0, 10)} />
      <WeightMeasurementChart
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
      <WeightMeasurementHistory
        title="Latest Measurements (5)"
        measurements={measurementsSortedByLatestDate.slice(0, 5)}
        showDeleteButton={false}
      />
    </Fragment>
  );
};

export default WeightOverviewForm;
