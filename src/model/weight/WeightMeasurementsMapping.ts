import { UIWeightMeasurement, UIWeightMeasurements } from './UIWeightMeasurements';
import { WeightMeasurementResponseDto } from './WeightMeasurementDtos';

export const buildMeasurementFromResponseDto = (
  measurementDto: WeightMeasurementResponseDto,
): UIWeightMeasurement => {
  return {
    userId: measurementDto.userId,
    measurementId: measurementDto.measurementId,
    date: new Date(measurementDto.date),
    timestamp: measurementDto.timestamp,
    note: measurementDto.note,
    measurements: {
      weight: measurementDto.measurements.weight,
      bodyFatPercentage: measurementDto.measurements.bodyFatPercentage,
      waterPercentage: measurementDto.measurements.waterPercentage,
      muscleMassPercentage: measurementDto.measurements.muscleMassPercentage,
      bonePercentage: measurementDto.measurements.bonePercentage,
      energyExpenditure: measurementDto.measurements.energyExpenditure,
    },
  };
};

export const buildMeasurementsFromResponseDto = (
  measurementsDto: WeightMeasurementResponseDto[],
): UIWeightMeasurements => {
  const measurements: UIWeightMeasurements = {
    measurements: [],
  };

  if (measurementsDto.length > 0) {
    measurementsDto.forEach((measurement) => {
      measurements.measurements.push(buildMeasurementFromResponseDto(measurement));
    });
  }

  return measurements;
};
