export interface MeasurementValsDto {
  weight: number;
  bodyFatPercentage?: number;
  waterPercentage?: number;
  muscleMassPercentage?: number;
  bonePercentage?: number;
  energyExpenditure?: number;
}

export interface MeasurementRequestDto {
  date: string;
  note: string;
  measurements: MeasurementValsDto;
}

export interface AddMeasurementRequestDto {
  measurement: MeasurementRequestDto;
}
