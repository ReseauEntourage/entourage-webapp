import { Observable } from 'rxjs'

export interface IStore<State> {
  state$: Observable<State>;
  getState(): State;
}
