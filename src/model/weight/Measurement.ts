export interface MeasurementDetails {
  weight: number;
  bodyFatPercentage?: number;
  waterPercentage?: number;
  muscleMassPercentage?: number;
  bonePercentage?: number;
  energyExpenditure?: number;
}

export interface Measurement {
  userId: string;
  measurementId: string;
  timestamp: number;
  date: Date;
  note?: string;
  measurements: MeasurementDetails;
}

export interface Measurements {
  measurements: Measurement[];
}

export interface SimpleMeasurement {
  id: string;
  date: Date;
  measurement: number;
}

export type SimpleMeasurements = SimpleMeasurement[];
