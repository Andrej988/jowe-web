import type { AuthTokens } from './AuthTokens';
import type { AuthenticatedUser } from './AuthenticatedUser';

export class AuthenticatedUserSession {
  constructor(public user: AuthenticatedUser, public tokens: AuthTokens) {}
}
