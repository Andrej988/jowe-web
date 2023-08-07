import { SERVICE_URL } from 'src/config/ServiceConfig';
import AccessTokenRetrievalService, {
  type AccessTokenRetrieval,
} from '../auth/AccessTokenRetrievalService';
import axios, { type AxiosRequestConfig } from 'axios';
import store, { weightActions } from 'src/store/Store';
import {
  AddMeasurementError,
  DeleteMeasurementError,
  MeasurementsRetrievalError,
} from './WeightMeasurementErrors';
import {
  AddWeightMeasurementRequestDto,
  EditWeightMeasurementRequestDto,
} from 'src/model/weight/WeightMeasurementDtos';
import {
  buildMeasurementFromResponseDto,
  buildMeasurementsFromResponseDto,
} from 'src/model/weight/WeightMeasurementsMapping';
import { UIWeightMeasurement } from 'src/model/weight/UIWeightMeasurements';

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
    return `${this.SERVICE_URL}/weight/measurements`;
  }

  private buildConfigWithAuthHeader(): AxiosRequestConfig<any> {
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.tokenRetrievalService.getAccessToken(),
      },
    };
  }

  async retrieveMeasurements(): Promise<void> {
    const serviceUrl = this.getServiceURL();
    const config = this.buildConfigWithAuthHeader();

    await new Promise((_resolve, reject) => {
      axios
        .get(serviceUrl, config)
        .then((response) => {
          const measurements = buildMeasurementsFromResponseDto(response.data.measurements);
          store.dispatch(weightActions.setMeasurements(measurements.measurements));
        })
        .catch((err) => {
          console.error('Error while retrieving measurements', err);
          if (err.response !== undefined) {
            console.error(
              'Error while inserting measurement',
              err.response.data.errorMsg !== undefined
                ? err.response.data.errorMsg
                : err.response.data !== undefined
                ? err.response.data
                : err.response,
            );
          }

          reject(
            new MeasurementsRetrievalError(
              'Error during retrieval of weight measurements!',
              err.stack,
            ),
          );
        });
    });
  }

  async addMeasurement(
    measurementDto: AddWeightMeasurementRequestDto,
  ): Promise<UIWeightMeasurement> {
    const serviceUrl = this.getServiceURL();
    const config = this.buildConfigWithAuthHeader();

    const requestBody = JSON.stringify(measurementDto);

    return await new Promise((resolve, reject) => {
      axios
        .post(serviceUrl, requestBody, config)
        .then((response) => {
          const measurement = buildMeasurementFromResponseDto(response.data.measurement);
          store.dispatch(weightActions.addMeasurement(measurement));
          resolve(measurement);
        })
        .catch((err) => {
          console.error('Error while inserting measurement', err);
          if (err.response !== undefined) {
            console.error(
              'Error while inserting measurement',
              err.response.data.errorMsg !== undefined
                ? err.response.data.errorMsg
                : err.response.data !== undefined
                ? err.response.data
                : err.response,
            );
          }

          reject(
            new AddMeasurementError('Error during insertion of weight measurement!', err.stack),
          );
        });
    });
  }

  async editMeasurement(
    measurementDto: EditWeightMeasurementRequestDto,
  ): Promise<UIWeightMeasurement> {
    const serviceUrl = this.getServiceURL();
    const config = this.buildConfigWithAuthHeader();

    const requestBody = JSON.stringify(measurementDto);

    return await new Promise((resolve, reject) => {
      axios
        .put(serviceUrl, requestBody, config)
        .then((response) => {
          const measurement = buildMeasurementFromResponseDto(response.data.measurement);
          store.dispatch(weightActions.updateMeasurement(measurement));
          resolve(measurement);
        })
        .catch((err) => {
          console.error('Error while editing measurement', err);
          if (err.response !== undefined) {
            console.error(
              'Error while editing measurement',
              err.response.data.errorMsg !== undefined
                ? err.response.data.errorMsg
                : err.response.data !== undefined
                ? err.response.data
                : err.response,
            );
          }

          reject(new AddMeasurementError('Error during editing of weight measurement!', err.stack));
        });
    });
  }

  async deleteMeasurement(measurementId: string): Promise<boolean> {
    const serviceUrl = this.getServiceURL() + `/${measurementId}`;
    const config = this.buildConfigWithAuthHeader();

    return await new Promise((resolve, reject) => {
      axios
        .delete(serviceUrl, config)
        .then(() => {
          store.dispatch(weightActions.removeMeasurement(measurementId));
          resolve(true);
        })
        .catch((err) => {
          console.error('Error while deleting measurement', err);
          if (err.response !== undefined) {
            console.error(
              'Error while deleting measurement',
              err.response.data.errorMsg !== undefined
                ? err.response.data.errorMsg
                : err.response.data !== undefined
                ? err.response.data
                : err.response,
            );
          }

          reject(
            new DeleteMeasurementError('Error during deletion of weight measurement!', err.stack),
          );
        });
    });
  }
}
