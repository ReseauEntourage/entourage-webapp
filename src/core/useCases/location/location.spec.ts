import { configureStore } from '../../configureStore'
import { PartialAppDependencies } from '../Dependencies'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'

import { publicActions } from './location.actions'
import { defaultLocationState, LocationState } from './location.reducer'
import { selectPosition } from './location.selectors'

function configureStoreWithLocation(
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
    Then location state should be at initial state
  `, () => {
    const store = configureStoreWithLocation({})
    expect(store.getState().location).toEqual(defaultLocationState)
  })
  it(`
    Given the initial state
    When user want to update all filters
    Then filters should be updated
  `, () => {
    const store = configureStoreWithLocation({})
    const position: LocationState['position'] = {
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
    const store = configureStoreWithLocation({})
    const position: Partial<LocationState['position']> = {
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }

    store.dispatch(publicActions.setPosition(position))

    expect(selectPosition(store.getState())).toEqual({
      ...defaultLocationState.position,
      ...position,
    })
  })
})
