import type { AuthTokens } from './AuthTokens';
import type { User } from './User';

export class AuthenticationData {
  constructor(public user: User, public tokens: AuthTokens) {}
}
