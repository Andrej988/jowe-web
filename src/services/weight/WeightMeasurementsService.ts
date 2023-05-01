import { SERVICE_URL } from 'src/config/ServiceConfig';
import AccessTokenRetrievalService, {
  type AccessTokenRetrieval,
} from '../auth/AccessTokenRetrievalService';
import axios, { type AxiosRequestConfig } from 'axios';
import { type AddMeasurementRequestDto } from 'src/model/weight/MeasurementDtos';

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
        Authorization: this.tokenRetrievalService.getAccessToken(),
      },
    };
  }

  private buildAddMeasurementRequestDto(
    date: string,
    note: string,
    weight: number,
    bodyFatPercentage?: number,
    waterPercentage?: number,
    muscleMassPercentage?: number,
    bonePercentage?: number,
    energyExpenditure?: number,
  ): AddMeasurementRequestDto {
    return {
      date,
      note,
      measurements: {
        weight,
        bodyFatPercentage,
        waterPercentage,
        muscleMassPercentage,
        bonePercentage,
        energyExpenditure,
      },
    };
  }

  async getMeasurements(): Promise<boolean> {
    const serviceUrl = this.getServiceURL();
    const config = this.buildConfigWithAuthHeader();

    return await new Promise((resolve, reject) => {
      axios
        .get(serviceUrl, config)
        .then((response) => {
          console.log('Success', response);
          resolve(true);
        })
        .catch((err) => {
          console.log('failed', err);
          reject(err);
        });
    });
  }

  async getMeasurement(measurementId: string): Promise<boolean> {
    const serviceUrl = this.getServiceURL();
    const config = this.buildConfigWithAuthHeader();

    return await new Promise((resolve, reject) => {
      axios
        .get(serviceUrl, config)
        .then((response) => {
          console.log('Success', response);
          resolve(true);
        })
        .catch((err) => {
          console.log('failed', err);
          reject(err);
        });
    });
  }

  async addMeasurement(
    date: string,
    note: string,
    weight: number,
    bodyFatPercentage?: number,
    waterPercentage?: number,
    muscleMassPercentage?: number,
    bonePercentage?: number,
    energyExpenditure?: number,
  ): Promise<boolean> {
    const serviceUrl = this.getServiceURL();
    const config = this.buildConfigWithAuthHeader();

    const measurementDto = this.buildAddMeasurementRequestDto(
      date,
      note,
      weight,
      bodyFatPercentage,
      waterPercentage,
      muscleMassPercentage,
      bonePercentage,
      energyExpenditure,
    );

    console.log('measurement should be used', measurementDto);

    return await new Promise((resolve, reject) => {
      axios
        .get(serviceUrl, config)
        .then((response) => {
          console.log('Success', response);
          resolve(true);
        })
        .catch((err) => {
          console.log('failed', err);
          reject(err);
        });
    });
  }

  async deleteMeasurement(measurementId: string): Promise<boolean> {
    const serviceUrl = this.getServiceURL();
    const config = this.buildConfigWithAuthHeader();

    return await new Promise((resolve, reject) => {
      axios
        .get(serviceUrl, config)
        .then((response) => {
          console.log('Success', response);
          resolve(true);
        })
        .catch((err) => {
          console.log('failed', err);
          reject(err);
        });
    });
  }
}
