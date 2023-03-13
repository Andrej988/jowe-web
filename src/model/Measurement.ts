export type MeasurementDetails = {
  weight: number;
  bodyFatPercentage: number;
  waterPercentage: number;
  muscleMassPercentage: number;
  bonePercentage: number;
  energyExpenditure: number;
};

export type Measurement = {
  userId: string;
  measurementId: string;
  timestamp: number;
  date: Date;
  comment: string;
  measurements: MeasurementDetails;
};

export type Measurements = {
  measurements: Measurement[];
};

export type SimpleMeasurement = {
  id: string;
  date: Date;
  measurement: number;
};

export type SimpleMeasurements = SimpleMeasurement[];
