import type { AuthTokens } from './AuthTokens';
import type { AuthenticatedUser } from './User';

export class AuthenticationData {
  constructor(public user: AuthenticatedUser, public tokens: AuthTokens) {}
}
