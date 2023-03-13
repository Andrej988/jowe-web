import React from 'react';

import MeasurementWidgets from './MeasurementWidgets';
import MeasurementHistory from './MeasurementHistory';
import MeasurementChart from './MeasurementChart';
import { Measurements } from 'src/model/Measurement';

const MainDashboard: React.FC<{}> = () => {
  const sampleData: Measurements = {
    measurements: [
      {
        userId: 'user_001',
        measurementId: '0',
        timestamp: 1148658951,
        date: new Date(1148658951),
        comment: 'test 0',
        measurements: {
          weight: 120.5,
          bodyFatPercentage: 32.24,
          waterPercentage: 12.25,
          muscleMassPercentage: 50,
          bonePercentage: 33.77,
          energyExpenditure: 3231,
        },
      },
      {
        userId: 'user_001',
        measurementId: '1',
        timestamp: 1678656541190,
        date: new Date(1678656541190),
        comment: 'test 1',
        measurements: {
          weight: 105.23,
          bodyFatPercentage: 25.24,
          waterPercentage: 12.25,
          muscleMassPercentage: 40,
          bonePercentage: 33.77,
          energyExpenditure: 2313,
        },
      },
      {
        userId: 'user_001',
        measurementId: '2',
        timestamp: 478656759802,
        date: new Date(478656759802),
        comment: 'test 2',
        measurements: {
          weight: 114.5,
          bodyFatPercentage: 15.24,
          waterPercentage: 12.25,
          muscleMassPercentage: 30,
          bonePercentage: 33.77,
          energyExpenditure: 2145,
        },
      },
      {
        userId: 'user_001',
        measurementId: '3',
        timestamp: 1278658951,
        date: new Date(1278658951),
        comment: 'test 3',
        measurements: {
          weight: 112.8,
          bodyFatPercentage: 11.24,
          waterPercentage: 12.25,
          muscleMassPercentage: 10,
          bonePercentage: 33.77,
          energyExpenditure: 4513,
        },
      },
      {
        userId: 'user_001',
        measurementId: '4',
        timestamp: 1674636541190,
        date: new Date(1674636541190),
        comment: 'test 4',
        measurements: {
          weight: 98.2,
          bodyFatPercentage: 27.24,
          waterPercentage: 12.25,
          muscleMassPercentage: 20,
          bonePercentage: 33.77,
          energyExpenditure: 2712,
        },
      },
      {
        userId: 'user_001',
        measurementId: '5',
        timestamp: 1656135472000,
        date: new Date(1656135472000),
        comment: 'test 5',
        measurements: {
          weight: 102.2,
          bodyFatPercentage: 23.24,
          waterPercentage: 13.25,
          muscleMassPercentage: 25,
          bonePercentage: 38.77,
          energyExpenditure: 1912,
        },
      },
    ],
  };

  const measurementsSortedByLatestDate = sampleData.measurements
    .slice()
    .sort((a: any, b: any) => b.date - a.date);

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
