import store, { weightActions } from 'src/store/Store';

export default class ClearReduxStateService {
  private static readonly instance: ClearReduxStateService = new ClearReduxStateService();

  // eslint-disable-next-line  @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): ClearReduxStateService {
    return this.instance;
  }

  clearReduxState(): void {
    store.dispatch(weightActions.resetState());
  }
}
