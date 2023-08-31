import { SERVICE_URL } from 'src/config/ServiceConfig';
import AccessTokenRetrievalService, {
  type AccessTokenRetrieval,
} from '../auth/AccessTokenRetrievalService';
import axios, { type AxiosRequestConfig } from 'axios';
import { ListValuesRetrievalError } from './ListValuesErrors';
import { ListValuesDto } from 'src/model/masterdata/ListValuesDto';

export default class ListValuesService {
  private static readonly instance: ListValuesService = new ListValuesService();

  private readonly tokenRetrievalService: AccessTokenRetrieval;
  private readonly SERVICE_URL: string | undefined;

  private constructor() {
    this.tokenRetrievalService = AccessTokenRetrievalService.getInstance();
    this.SERVICE_URL = SERVICE_URL;
  }

  public static getInstance(): ListValuesService {
    return this.instance;
  }

  private getServiceURL(): string {
    if (this.SERVICE_URL === undefined) {
      throw Error('Missing service URL configuration!');
    }
    return `${this.SERVICE_URL}/masterdata/list-values`;
  }

  private buildConfigWithAuthHeader(): AxiosRequestConfig {
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.tokenRetrievalService.getAccessToken(),
      },
    };
  }

  async retrieveValues(listId: string): Promise<ListValuesDto> {
    const serviceUrl = this.getServiceURL() + `/${listId}`;
    const config = this.buildConfigWithAuthHeader();

    return new Promise((resolve, reject) => {
      axios
        .get(serviceUrl, config)
        .then((response) => {
          const values: ListValuesDto = response.data;
          resolve(values);
        })
        .catch((err) => {
          console.error('Error while retrieving list values', err);
          if (err.response !== undefined) {
            console.error(
              'Error while retrieving list values',
              err.response.data.errorMsg !== undefined
                ? err.response.data.errorMsg
                : err.response.data !== undefined
                ? err.response.data
                : err.response,
            );
          }

          reject(new ListValuesRetrievalError('Error during retrieval of list values!', err.stack));
        });
    });
  }
}
