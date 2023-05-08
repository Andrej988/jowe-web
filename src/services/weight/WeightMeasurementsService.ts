import { SERVICE_URL } from 'src/config/ServiceConfig';
import AccessTokenRetrievalService, {
  type AccessTokenRetrieval,
} from '../auth/AccessTokenRetrievalService';
import axios, { type AxiosRequestConfig } from 'axios';
import type {
  AddMeasurementRequestDto,
  MeasurementResponseDto,
} from 'src/model/weight/MeasurementDtos';
import type { Measurement, Measurements } from 'src/model/weight/Measurement';
import store, { weightActions } from 'src/store/Store';
import { AddMeasurementError, DeleteMeasurementError } from './WeightMeasurementErrors';

export default class WeightMeasurementsService {
  private static readonly instance: WeightMeasurementsService = new WeightMeasurementsService();

  private readonly tokenRetrievalService: AccessTokenRetrieval;
  private readonly SERVICE_URL: string | undefined;

  private constructor() {
    this.tokenRetrievalService = AccessTokenRetrievalService.getInstance();
    this.SERVICE_URL = SERVICE_URL;
  }

  public static getInstance(): WeightMeasurementsService {
    return this.instance;
  }

  private getServiceURL(): string {
    if (this.SERVICE_URL === undefined) {
      throw Error('Missing service URL configuration!');
    }
    return `${this.SERVICE_URL}/measurements`;
  }

  private buildConfigWithAuthHeader(): AxiosRequestConfig<any> {
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.tokenRetrievalService.getAccessToken(),
      },
    };
  }

  private buildAddMeasurementRequestDto(
    dateInstant: number,
    note: string,
    weight: number,
    bodyFatPercentage?: number,
    waterPercentage?: number,
    muscleMassPercentage?: number,
    bonePercentage?: number,
    energyExpenditure?: number,
  ): AddMeasurementRequestDto {
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
  }

  private buildMeasurementFromResponseDto(measurementDto: MeasurementResponseDto): Measurement {
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
  }

  private buildMeasurementsFromResponseDto(
    measurementsDto: MeasurementResponseDto[],
  ): Measurements {
    const measurements: Measurements = {
      measurements: [],
    };

    measurementsDto.forEach((measurement) => {
      measurements.measurements.push(this.buildMeasurementFromResponseDto(measurement));
    });

    return measurements;
  }

  async retrieveMeasurements(): Promise<void> {
    const serviceUrl = this.getServiceURL();
    const config = this.buildConfigWithAuthHeader();

    await new Promise((_resolve, reject) => {
      axios
        .get(serviceUrl, config)
        .then((response) => {
          const measurements = this.buildMeasurementsFromResponseDto(response.data.measurements);
          store.dispatch(weightActions.setMeasurements(measurements.measurements));
        })
        .catch((err) => {
          console.error('failed retrieving weight measurements', err);
          reject(err);
        });
    });
  }

  async addMeasurement(
    dateInstant: number,
    note: string,
    weight: number,
    bodyFatPercentage?: number,
    waterPercentage?: number,
    muscleMassPercentage?: number,
    bonePercentage?: number,
    energyExpenditure?: number,
  ): Promise<Measurement> {
    const serviceUrl = this.getServiceURL();
    const config = this.buildConfigWithAuthHeader();

    const requestBody = JSON.stringify(
      this.buildAddMeasurementRequestDto(
        dateInstant,
        note,
        weight,
        bodyFatPercentage,
        waterPercentage,
        muscleMassPercentage,
        bonePercentage,
        energyExpenditure,
      ),
    );

    console.log('measurement should be used', requestBody);

    return await new Promise((resolve, reject) => {
      axios
        .post(serviceUrl, requestBody, config)
        .then((response) => {
          console.log('Success', response);
          const measurement = this.buildMeasurementFromResponseDto(response.data.measurement);
          store.dispatch(weightActions.addMeasurement(measurement));
          resolve(measurement);
        })
        .catch((err) => {
          console.error('error', err);
          reject(
            new AddMeasurementError('Error during insertion of weight measurement!', err.stack),
          );
        });
    });
  }

  async deleteMeasurement(measurementId: string): Promise<boolean> {
    const serviceUrl = this.getServiceURL() + `/${measurementId}`;
    const config = this.buildConfigWithAuthHeader();

    return await new Promise((resolve, reject) => {
      axios
        .delete(serviceUrl, config)
        .then((response) => {
          store.dispatch(weightActions.removeMeasurement(measurementId));
          resolve(true);
        })
        .catch((err) => {
          console.error('error', err);
          reject(
            new DeleteMeasurementError('Error during deletion of weight measurement!', err.stack),
          );
        });
    });
  }
}
