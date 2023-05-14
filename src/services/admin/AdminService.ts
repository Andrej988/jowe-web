import { SERVICE_URL } from 'src/config/ServiceConfig';
import AccessTokenRetrievalService, {
  type AccessTokenRetrieval,
} from '../auth/AccessTokenRetrievalService';
import axios, { type AxiosRequestConfig } from 'axios';
import { DeleteUserDataError } from './AdminErrors';

export default class AdminService {
  private static readonly instance: AdminService = new AdminService();

  private readonly tokenRetrievalService: AccessTokenRetrieval;
  private readonly SERVICE_URL: string | undefined;

  private constructor() {
    this.tokenRetrievalService = AccessTokenRetrievalService.getInstance();
    this.SERVICE_URL = SERVICE_URL;
  }

  public static getInstance(): AdminService {
    return this.instance;
  }

  private getServiceURL(): string {
    if (this.SERVICE_URL === undefined) {
      throw Error('Missing service URL configuration!');
    }
    return `${this.SERVICE_URL}/admin/delete-user-data`;
  }

  private buildConfigWithAuthHeader(): AxiosRequestConfig<any> {
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.tokenRetrievalService.getAccessToken(),
      },
    };
  }

  async deleteUserData(): Promise<boolean> {
    const serviceUrl = this.getServiceURL();
    const config = this.buildConfigWithAuthHeader();

    return await new Promise((resolve, reject) => {
      axios
        .post(serviceUrl, null, config)
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          console.error('Error while deleting user data', err);
          if (err.response !== undefined) {
            console.error(
              'Error while deleting user data',
              err.response.data.errorMsg !== undefined
                ? err.response.data.errorMsg
                : err.response.data !== undefined
                ? err.response.data
                : err.response,
            );
          }

          reject(new DeleteUserDataError('Error during deletion of user data!', err.stack));
        });
    });
  }
}
