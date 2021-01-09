import { normalize } from 'normalizr'
import { createEntourage, createUser } from '../mock'
import { reducers, defaultInitialAppState, PartialAppState } from '../reducers'
import { configureStore } from 'src/core/configureStore'
import { publicActions } from './entities.actions'
import { EntitiesState } from './entities.reducer'
import { entourageSchema } from './entities.schemas'
import { selectEntities } from './entities.selector'

function configureStoreWithEntities(initialAppState?: PartialAppState) {
  return configureStore({
    initialState: {
      ...defaultInitialAppState,
      ...initialAppState,
    },
    reducers,
  })
}

describe('Entities', () => {
  it(`
    Given default state
    When no action is triggered
    Then entities should be empty
  `, () => {
    const store = configureStoreWithEntities()

    expect(store.getState().entities).toEqual({
      entourages: {},
      users: {},
    })
  })

  it(`
    Given default state
    When I update entity that does not exist
    Then entity should be created
  `, () => {
    const store = configureStoreWithEntities()

    const entourageA = createEntourage()
    const entourageB = createEntourage()
    const user1 = createUser()
    const user2 = createUser()

    const entourages = [
      {
        ...entourageA,
        author: user1,
      },
      {
        ...entourageB,
        author: user2,
      },
    ]

    const { entities } = normalize(entourages, [entourageSchema])

    store.dispatch(publicActions.updateEntities({ entities }))

    const expectedState: EntitiesState = {
      entourages: {
        [entourageA.uuid]: {
          ...entourageA,
          author: user1.id,
        },
        [entourageB.uuid]: {
          ...entourageB,
          author: user2.id,
        },
      },
      users: {
        [user1.id]: user1,
        [user2.id]: user2,
      },
    }

    expect(store.getState().entities).toEqual(expectedState)
  })

  it(`
    Given state with entourage
    When I update entity that does not exist
    Then entity should updated
  `, () => {
    const entourageA = createEntourage()
    const user1 = createUser()

    const store = configureStoreWithEntities({
      entities: {
        entourages: {
          [entourageA.uuid]: entourageA,
        },
        users: {
          [user1.id]: user1,
        },
      },
    })

    const entourages = [
      {
        uuid: entourageA.uuid,
        description: 'entourtage A updated',
      },
    ]

    const { entities } = normalize(entourages, [entourageSchema])

    store.dispatch(publicActions.updateEntities({ entities }))

    const expectedState: EntitiesState = {
      entourages: {
        [entourageA.uuid]: {
          ...entourageA,
          description: 'entourtage A updated',
        },
      },
      users: {
        [user1.id]: user1,
      },
    }

    expect(store.getState().entities).toEqual(expectedState)
  })

  it(`
    Given state has entities
    When I select entities
    Then I should get data denormalized
  `, () => {
    const entourageA = createEntourage()
    const entourageB = createEntourage()
    const user1 = createUser()
    const user2 = createUser()

    const initialStateEntities: EntitiesState = {
      entourages: {
        [entourageA.uuid]: {
          ...entourageA,
          author: user1.id,
        },
        [entourageB.uuid]: {
          ...entourageB,
          author: user2.id,
        },
      },
      users: {
        [user1.id]: user1,
        [user2.id]: user2,
      },
    }

    const store = configureStoreWithEntities({
      entities: initialStateEntities,
    })

    const expectedDenormalizedData = [
      {
        ...entourageA,
        author: user1,
      },
      {
        ...entourageB,
        author: user2,
      },
    ]

    expect(selectEntities(store.getState(), [entourageA.uuid, entourageB.uuid], [entourageSchema]))
      .toEqual(expectedDenormalizedData)
  })
})
