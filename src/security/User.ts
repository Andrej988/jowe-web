export class User {
  constructor(
    public username?: string,
    public name?: string,
    public email?: string,
    public emailVerified?: boolean,
    public gender?: string,
  ) {}
}
