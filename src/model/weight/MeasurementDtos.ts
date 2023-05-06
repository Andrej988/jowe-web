export interface MeasurementValsDto {
  weight: number;
  bodyFatPercentage?: number;
  waterPercentage?: number;
  muscleMassPercentage?: number;
  bonePercentage?: number;
  energyExpenditure?: number;
}

export interface MeasurementRequestDto {
  date: number;
  note?: string;
  measurements: MeasurementValsDto;
}

export interface AddMeasurementRequestDto {
  measurement: MeasurementRequestDto;
}

export interface MeasurementResponseDto {
  userId: string;
  measurementId: string;
  date: number;
  timestamp: number;
  note?: string;
  measurements: MeasurementValsDto;
}

export interface MeasurementsResponseDto {
  measurement: MeasurementResponseDto[];
}
