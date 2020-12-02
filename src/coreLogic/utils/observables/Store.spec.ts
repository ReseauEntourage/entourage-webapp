import { map, distinctUntilChanged, skip, filter } from 'rxjs/operators'
import { Store } from './Store'

interface FakeStare {
  foo: number;
}

class FakeFeature extends Store<FakeStare> {
  public foo$ = this.state$.pipe(
    map((state) => state.foo),
    filter((value) => value === this.getState().foo),
  )

  constructor(private initialState: FakeStare) {
    super(initialState)

    this.foo$.pipe(
      skip(1),
      distinctUntilChanged(),
    ).subscribe((value) => {
      if (value < 5) {
        this.setFoo(value + 0.5)
      }
    })
  }

  setFoo(value: number) {
    this.setState({ foo: value })
  }
}

describe('Store', () => {
  it('should handle state and internal state differently', () => {
    const feature = new FakeFeature({ foo: 1 })

    const featureFooSubscribe = jest.fn()

    feature.foo$.subscribe(featureFooSubscribe)

    feature.setFoo(2)

    expect(featureFooSubscribe).toHaveBeenNthCalledWith(1, 1)
    expect(featureFooSubscribe).toHaveBeenNthCalledWith(2, 5)
    expect(featureFooSubscribe).toHaveBeenCalledTimes(2)
  })
})
