export interface MeasurementValsDto {
  weight: number;
  bodyFatPercentage?: number;
  waterPercentage?: number;
  muscleMassPercentage?: number;
  bonePercentage?: number;
  energyExpenditure?: number;
}

export interface AddMeasurementRequestDto {
  date: string;
  note: string;
  measurements: MeasurementValsDto;
}
