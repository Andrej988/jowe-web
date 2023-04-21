export class AuthTokens {
  constructor(
    public accessToken?: AccessToken,
    public refreshToken?: RefreshToken,
    public idToken?: IdToken,
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.idToken = idToken;
  }
}

export class SimpleToken {
  constructor(public token: string) {
    this.token = token;
  }
}

export class ComplexToken extends SimpleToken {
  constructor(token: string, public expiration: number, public issuedAt: number) {
    super(token);
    this.expiration = expiration;
    this.issuedAt = issuedAt;
  }
}

export class AccessToken extends ComplexToken {}

export class RefreshToken extends SimpleToken {}

export class IdToken extends ComplexToken {}
