import { SERVICE_URL } from 'src/config/ServiceConfig';
import AccessTokenRetrievalService, {
  type AccessTokenRetrieval,
} from '../auth/AccessTokenRetrievalService';
import axios, { type AxiosRequestConfig } from 'axios';
import store, { weightActions } from 'src/store/Store';
import type { TargetWeightResponseDto } from 'src/model/weight/TargetWeightsDtos';
import type { TargetWeight, TargetWeights } from 'src/model/weight/TargetWeights';
import {
  AddTargetWeightError,
  DeleteTargetWeightError,
  TargetWeightRetrievalError,
} from './WeightTargetsErrors';

export default class WeightTargetsService {
  private static readonly instance: WeightTargetsService = new WeightTargetsService();

  private readonly tokenRetrievalService: AccessTokenRetrieval;
  private readonly SERVICE_URL: string | undefined;

  private constructor() {
    this.tokenRetrievalService = AccessTokenRetrievalService.getInstance();
    this.SERVICE_URL = SERVICE_URL;
  }

  public static getInstance(): WeightTargetsService {
    return this.instance;
  }

  private getServiceURL(): string {
    if (this.SERVICE_URL === undefined) {
      throw Error('Missing service URL configuration!');
    }
    return `${this.SERVICE_URL}/weight/targets`;
  }

  private buildConfigWithAuthHeader(): AxiosRequestConfig<any> {
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.tokenRetrievalService.getAccessToken(),
      },
    };
  }

  private buildTargetWeightFromResponseDto(responseDto: TargetWeightResponseDto): TargetWeight {
    return {
      userId: responseDto.userId,
      recordId: responseDto.recordId,
      date: new Date(responseDto.timestamp),
      timestamp: responseDto.timestamp,
      targetWeight: responseDto.targetWeight,
    };
  }

  private buildTargetWeightsFromResponseDto(responseDto: TargetWeightResponseDto[]): TargetWeights {
    const targets: TargetWeights = {
      targetWeights: [],
    };

    if (responseDto.length > 0) {
      responseDto.forEach((element) => {
        targets.targetWeights.push(this.buildTargetWeightFromResponseDto(element));
      });
    }

    return targets;
  }

  async retrieveTargetWeights(): Promise<void> {
    const serviceUrl = this.getServiceURL();
    const config = this.buildConfigWithAuthHeader();

    await new Promise((_resolve, reject) => {
      axios
        .get(serviceUrl, config)
        .then((response) => {
          const targetWeights = this.buildTargetWeightsFromResponseDto(response.data.targetWeights);
          store.dispatch(weightActions.setTargetWeights(targetWeights.targetWeights));
        })
        .catch((err) => {
          console.error('Error while retrieving target weights', err);
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
            new TargetWeightRetrievalError('Error during retrieval of target weights!', err.stack),
          );
        });
    });
  }

  async addTargetWeight(targetWeight: number): Promise<TargetWeight> {
    const serviceUrl = this.getServiceURL();
    const config = this.buildConfigWithAuthHeader();

    const requestBody = JSON.stringify({ targetWeight });

    return await new Promise((resolve, reject) => {
      axios
        .post(serviceUrl, requestBody, config)
        .then((response) => {
          const targetWeight = this.buildTargetWeightFromResponseDto(response.data.target);
          store.dispatch(weightActions.addTargetWeight(targetWeight));
          resolve(targetWeight);
        })
        .catch((err) => {
          console.error('Error while inserting target weight', err);
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

          reject(new AddTargetWeightError('Error during insertion of target weight!', err.stack));
        });
    });
  }

  async deleteTargetWeight(recordId: string): Promise<boolean> {
    const serviceUrl = this.getServiceURL() + `/${recordId}`;
    const config = this.buildConfigWithAuthHeader();

    return await new Promise((resolve, reject) => {
      axios
        .delete(serviceUrl, config)
        .then(() => {
          store.dispatch(weightActions.removeTargetWeight(recordId));
          resolve(true);
        })
        .catch((err) => {
          console.error('Error while deleting target weight', err);
          if (err.response !== undefined) {
            console.error(
              'Error while deleting target weight',
              err.response.data.errorMsg !== undefined
                ? err.response.data.errorMsg
                : err.response.data !== undefined
                ? err.response.data
                : err.response,
            );
          }

          reject(new DeleteTargetWeightError('Error during deletion of target weight!', err.stack));
        });
    });
  }
}
