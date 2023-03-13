import React from 'react';

import MeasurementWidgets from './MeasurementWidgets';
import MeasurementHistory from './MeasurementHistory';
import MeasurementChart from './MeasurementChart';
import { getTestMeasurements } from 'src/model/TestMeasurements';

const sampleData = getTestMeasurements();

const measurementsSortedByLatestDate = sampleData.measurements
  .slice()
  .sort((a: any, b: any) => b.date - a.date);

const MainDashboard: React.FC<{}> = () => {
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
