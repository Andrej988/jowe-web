import type { AuthTokens } from './AuthTokens';
import type { AuthenticatedUser } from './UserData';

export class AuthenticationData {
  constructor(public user: AuthenticatedUser, public tokens: AuthTokens) {}
}
