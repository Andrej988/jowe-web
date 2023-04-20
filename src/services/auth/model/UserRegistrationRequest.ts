export class UserRegistrationRequest {
  constructor(
    public username: string,
    public name: string,
    public email: string,
    public password: string,
    public gender: string,
  ) {}
}
