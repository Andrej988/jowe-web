export interface WeightMeasurementValsDto {
  weight: number;
  bodyFatPercentage?: number;
  waterPercentage?: number;
  muscleMassPercentage?: number;
  bonePercentage?: number;
  energyExpenditure?: number;
}

export interface WeightMeasurementRequestDto {
  date: number;
  note?: string;
  measurements: WeightMeasurementValsDto;
}

export interface WeightMeasurementWithIdRequestDto extends WeightMeasurementRequestDto {
  measurementId: string;
}

export interface AddWeightMeasurementRequestDto {
  measurement: WeightMeasurementRequestDto;
}

export interface EditWeightMeasurementRequestDto {
  measurement: WeightMeasurementWithIdRequestDto;
}

export interface WeightMeasurementResponseDto {
  userId: string;
  measurementId: string;
  date: number;
  timestamp: number;
  note?: string;
  lastModified?: number;
  measurements: WeightMeasurementValsDto;
}

export interface WeightMeasurementsResponseDto {
  measurement: WeightMeasurementResponseDto[];
}

export const buildAddWeightMeasurementRequestDto = (
  dateInstant: number,
  note: string,
  weight: number,
  bodyFatPercentage?: number,
  waterPercentage?: number,
  muscleMassPercentage?: number,
  bonePercentage?: number,
  energyExpenditure?: number,
): AddWeightMeasurementRequestDto => {
  return {
    measurement: {
      date: dateInstant,
      note,
      measurements: {
        weight,
        bodyFatPercentage,
        waterPercentage,
        muscleMassPercentage,
        bonePercentage,
        energyExpenditure,
      },
    },
  };
};

export const buildEditWeightMeasurementRequestDto = (
  measurementId: string,
  dateInstant: number,
  note: string,
  weight: number,
  bodyFatPercentage?: number,
  waterPercentage?: number,
  muscleMassPercentage?: number,
  bonePercentage?: number,
  energyExpenditure?: number,
): EditWeightMeasurementRequestDto => {
  return {
    measurement: {
      measurementId: measurementId,
      date: dateInstant,
      note,
      measurements: {
        weight,
        bodyFatPercentage,
        waterPercentage,
        muscleMassPercentage,
        bonePercentage,
        energyExpenditure,
      },
    },
  };
};
