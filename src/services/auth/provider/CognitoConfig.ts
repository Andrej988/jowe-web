export class CognitoConfig {
  public userPool: string;
  public clientId: string;

  constructor(userPool: string | undefined, clientId: string | undefined) {
    if (userPool == null || clientId == null) {
      throw Error('Missing Cognito configuration');
    }
    this.userPool = userPool;
    this.clientId = clientId;
  }
}
