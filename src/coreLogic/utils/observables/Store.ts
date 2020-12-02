import { BehaviorSubject } from 'rxjs'
import { filter } from 'rxjs/operators'
import { IStore } from './IStore'

type SetStatePartial<State> = Partial<State> | ((value: State) => Partial<State>)
type SetState<State> = State | ((value: State) => State)

export class Store<State> implements IStore<State> {
  private store = new BehaviorSubject<State>(this.state);

  state$ = this.store.asObservable().pipe(
    filter((state) => state === this.state),
  );

  constructor(private state: State) {}

  protected setState<T extends boolean>(
    nextPartialState: T extends false ? SetStatePartial<State> : SetState<State>,
    options: { replace?: T; } = {},
  ) {
    const prevState = options.replace
      ? null
      : this.state

    this.state = typeof nextPartialState === 'function'
      ? { ...prevState, ...nextPartialState(this.state) }
      : { ...prevState, ...nextPartialState }

    this.store.next(this.state)
  }

  public getState() {
    return this.state
  }
}
