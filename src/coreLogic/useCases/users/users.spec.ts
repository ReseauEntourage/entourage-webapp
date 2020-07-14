import { InMemoryEntourageGateway } from '../../../adapters/secondary/InMemoryEntourageGateway'
import { createReduxStore, getInitialStateResources, ReduxResourceRequest, ReduxResourceMeta } from '../../../store'
import { AnyToFix } from 'src/utils/types'
import { authUserIdReducer } from './authUserId.reducer'
import { retrieveAuthUser, authUserLogout } from './users.actions'
import { retrieveAuthUserEpic } from './users.epic'
import { usersReducer } from './users.reducer'
import { getAuthUser, getAuthUserIsLogging } from './users.selectors'

describe('Retrieve Auth User', () => {
  let store: AnyToFix
  let entourageGateway: InMemoryEntourageGateway
  const usersInitialState = getInitialStateResources('users')

  beforeEach(() => {
    entourageGateway = new InMemoryEntourageGateway()

    store = createReduxStore({
      dependencies: {
        entourageGateway,
      },
      reducers: {
        users: usersReducer,
        authUserId: authUserIdReducer,
      },
      epics: [retrieveAuthUserEpic],
    })
  })

  it('should user state equal to initial state if no action was dispatched', () => {
    expect(store.getState()).toEqual({
      authUserId: null,
      users: usersInitialState,
    })
  })

  it('should show logging state during user authentication', () => {
    entourageGateway.delayResponse = 1000

    store.dispatch(retrieveAuthUser())

    const expectedRequest: ReduxResourceRequest = {
      requestKey: 'retrieveAuthUser',
      requestName: 'retrieveAuthUser',
      resourceType: 'users',
      status: 'PENDING',
    }

    expect(store.getState()).toEqual({
      authUserId: null,
      users: {
        ...usersInitialState,
        requests: {
          retrieveAuthUser: expectedRequest,
        },
      },
    })

    expect(getAuthUserIsLogging(store.getState())).toEqual(true)
  })

  it('should users be empty if me user is not authenticated', () => {
    entourageGateway.user = null

    store.dispatch(retrieveAuthUser())

    const expectedRequest: ReduxResourceRequest = {
      requestKey: 'retrieveAuthUser',
      requestName: 'retrieveAuthUser',
      resourceType: 'users',
      status: 'SUCCEEDED',
      ids: [],
    }

    expect(store.getState()).toEqual({
      authUserId: null,
      users: {
        ...usersInitialState,
        resources: {},
        requests: {
          retrieveAuthUser: expectedRequest,
        },
      },
    })

    expect(getAuthUser(store.getState())).toEqual(null)
    expect(getAuthUserIsLogging(store.getState())).toEqual(false)
  })

  it('should users not be empty if me user is authenticated', () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      id: 1,
      uuid: 'abc',
    }

    entourageGateway.user = user

    store.dispatch(retrieveAuthUser())

    const expectedRequest: ReduxResourceRequest = {
      requestKey: 'retrieveAuthUser',
      requestName: 'retrieveAuthUser',
      resourceType: 'users',
      status: 'SUCCEEDED',
      ids: [user.id],
    }

    const expectedUserMeta: ReduxResourceMeta = {
      createStatus: 'IDLE',
      updateStatus: 'IDLE',
      deleteStatus: 'IDLE',
      readStatus: 'SUCCEEDED',
    }

    expect(store.getState()).toEqual({
      authUserId: user.id,
      users: {
        ...usersInitialState,
        resources: {
          [user.id]: user,
        },
        requests: {
          retrieveAuthUser: expectedRequest,
        },
        meta: {
          [user.id]: expectedUserMeta,
        },
      },
    })

    expect(getAuthUser(store.getState())).toEqual(user)
  })

  it('should auth user id be null on logout', () => {
    store = createReduxStore({
      dependencies: {
        entourageGateway,
      },
      reducers: {
        users: usersReducer,
        authUserId: authUserIdReducer,
      },
      epics: [retrieveAuthUserEpic],
      initialState: {
        authUserId: 3,
      },
    })

    store.dispatch(authUserLogout())

    expect(store.getState()).toEqual({
      authUserId: null,
      users: usersInitialState,
    })
  })
})
