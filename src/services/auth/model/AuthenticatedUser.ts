export class AuthenticatedUser {
  constructor(
    public username?: string,
    public name?: string,
    public email?: string,
    public gender?: string,
    public emailVerified?: boolean,
  ) {}
}
