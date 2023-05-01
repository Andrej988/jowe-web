import AuthService from './AuthService';

export interface AccessTokenRetrieval {
  getAccessToken: () => string;
}

export default class AccessTokenRetrievalService implements AccessTokenRetrieval {
  private static readonly instance: AccessTokenRetrievalService = new AccessTokenRetrievalService();

  public static getInstance(): AccessTokenRetrievalService {
    return this.instance;
  }

  getAccessToken(): string {
    return AuthService.getInstance().getAccessToken();
  }
}
