import store, { weightActions } from 'src/store/Store';

export default class ClearReduxStateService {
  private static readonly instance: ClearReduxStateService = new ClearReduxStateService();

  private constructor() {}

  public static getInstance(): ClearReduxStateService {
    return this.instance;
  }

  clearReduxState(): void {
    console.log('clearing redux state');
    store.dispatch(weightActions.resetState());
    console.log('redux state cleared');
  }
}
