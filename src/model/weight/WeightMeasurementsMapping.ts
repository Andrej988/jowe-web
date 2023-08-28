import { UIWeightMeasurement, UIWeightMeasurements } from './UIWeightMeasurements';
import { WeightMeasurementResponseDto } from './WeightMeasurementDtos';

export const buildMeasurementFromResponseDto = (
  dto: WeightMeasurementResponseDto,
): UIWeightMeasurement => {
  return {
    userId: dto.userId,
    measurementId: dto.measurementId,
    date: new Date(dto.date),
    timestamp: dto.timestamp,
    note: dto.note,
    lastModified: dto.lastModified,
    measurements: {
      weight: dto.measurements.weight,
      bodyFatPercentage: dto.measurements.bodyFatPercentage,
      waterPercentage: dto.measurements.waterPercentage,
      muscleMassPercentage: dto.measurements.muscleMassPercentage,
      bonePercentage: dto.measurements.bonePercentage,
      energyExpenditure: dto.measurements.energyExpenditure,
    },
  };
};

export const buildMeasurementsFromResponseDto = (
  dto: WeightMeasurementResponseDto[],
): UIWeightMeasurements => {
  const measurements: UIWeightMeasurements = {
    measurements: [],
  };

  if (dto.length > 0) {
    dto.forEach((item) => {
      measurements.measurements.push(buildMeasurementFromResponseDto(item));
    });
  }

  return measurements;
};
