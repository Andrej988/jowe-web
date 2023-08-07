export interface UIWeightMeasurementDetails {
  weight: number;
  bodyFatPercentage?: number;
  waterPercentage?: number;
  muscleMassPercentage?: number;
  bonePercentage?: number;
  energyExpenditure?: number;
}

export interface UIWeightMeasurement {
  userId: string;
  measurementId: string;
  timestamp: number;
  date: Date;
  note?: string;
  measurements: UIWeightMeasurementDetails;
}

export interface UIWeightMeasurements {
  measurements: UIWeightMeasurement[];
}

export interface UISimpleWeightMeasurement {
  id: string;
  date: Date;
  measurement: number;
}

export type UISimpleWeightMeasurements = UISimpleWeightMeasurement[];
