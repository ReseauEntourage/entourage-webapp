import { configureStore } from '../../configureStore'
import { PartialAppDependencies } from '../Dependencies'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'

import { publicActions } from './position.actions'
import { defaultPositionState, PositionState } from './position.reducer'
import { selectPosition } from './position.selectors'

function configureStoreWithPosition(
  params: {
    dependencies?: PartialAppDependencies;
    initialAppState?: PartialAppState;
  },
) {
  const { initialAppState, dependencies } = params

  return configureStore({
    reducers,
    initialState: {
      ...defaultInitialAppState,
      ...initialAppState,
    },
    dependencies,
    sagas: [],
  })
}

describe('POIs', () => {
  it(`
    Given initial state
    When no action is triggered
    Then position state should be at initial state
  `, () => {
    const store = configureStoreWithPosition({})
    expect(store.getState().position).toEqual(defaultPositionState)
  })
  it(`
    Given the initial state
    When user want to update all filters
    Then filters should be updated
  `, () => {
    const store = configureStoreWithPosition({})
    const position: PositionState['position'] = {
      cityName: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }

    store.dispatch(publicActions.setPosition(position))

    expect(selectPosition(store.getState())).toEqual(position)
  })

  it(`
    Given the initial state
    When user want to update partially update filters
    Then filters should be updated and merge with existing filters
  `, () => {
    const store = configureStoreWithPosition({})
    const position: Partial<PositionState['position']> = {
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }

    store.dispatch(publicActions.setPosition(position))

    expect(selectPosition(store.getState())).toEqual({
      ...defaultPositionState.position,
      ...position,
    })
  })
})
