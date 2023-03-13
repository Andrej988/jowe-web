export class AuthTokens {
  accessToken: AccessToken | undefined;
  refreshToken: RefreshToken | undefined;
  idToken: IdToken | undefined;

  constructor(accessToken?: AccessToken, refreshToken?: RefreshToken, idToken?: IdToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.idToken = idToken;
  }
}

export class SimpleToken {
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}

export class ComplexToken extends SimpleToken {
  expiration: number;
  issuedAt: number;

  constructor(token: string, expiration: number, issuedAt: number) {
    super(token);
    this.expiration = expiration;
    this.issuedAt = issuedAt;
  }
}

export class AccessToken extends ComplexToken {}

export class RefreshToken extends SimpleToken {}

export class IdToken extends ComplexToken {}
