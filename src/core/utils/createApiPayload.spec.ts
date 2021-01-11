/* eslint-disable no-unused-expressions */

import { createApiPayload, ActionFromApiAction } from './createApiPayload'

describe('createApiPayload', () => {
  it('Should have TS error because params is missing', () => {
    // @ts-expect-error
    createApiPayload({
      name: '/feeds GET',
    })
  })

  describe('Test with action types', () => {
    const ActionType = {
      REQUESTED: 'REQUESTED',
      SUCCEEDED: 'SUCCEEDED',
      FAILED: 'FAILED',
    } as const

    function actionFn() {
      return {
        type: ActionType.REQUESTED,
        payload: createApiPayload({
          name: '/feeds GET',
          params: {
            latitude: 1,
            longitude: 2,
          },
        }),
        types: [
          ActionType.SUCCEEDED,
          ActionType.FAILED,
        ] as const,
      }
    }

    type Action = ActionFromApiAction<typeof actionFn>
    const action = {} as Action

    it('Requested: should have no TS error when we access to requested action data', () => {
      if (action.type === ActionType.REQUESTED) {
        action.payload.params.latitude
      }
    })

    it('Requested: should have TS error when we access to suceeded action data', () => {
      if (action.type === ActionType.REQUESTED) {
        // @ts-expect-error
        action.response.data.feeds.map((feed) => feed.data.id)
      }
    })

    it('Requested: should have TS error when we access to failed action data', () => {
      if (action.type === ActionType.REQUESTED) {
        // @ts-expect-error
        action.response.data.message
      }
    })

    // -----

    it('succeeded: should have TS error when we access to requested action data', () => {
      if (action.type === ActionType.SUCCEEDED) {
        // @ts-expect-error
        action.payload.params.latitude
      }
    })

    it('succeeded: should have no TS error when we access to suceeded action data', () => {
      if (action.type === ActionType.SUCCEEDED) {
        action.response.data.feeds.map((feed) => feed.data.id)
      }
    })

    it('succeeded: should have TS error when we access to failed action data', () => {
      if (action.type === ActionType.SUCCEEDED) {
        // @ts-expect-error
        action.response.data.message
      }
    })

    // ------

    it('failed: should have TS error when we access to requested action data', () => {
      if (action.type === ActionType.FAILED) {
        // @ts-expect-error
        action.payload.params.latitude
      }
    })

    it('failed: should have no TS error when we access to suceeded action data', () => {
      if (action.type === ActionType.FAILED) {
        // @ts-expect-error
        action.response.data.feeds.map((feed) => feed.data.id)
      }
    })

    it('failed: should have TS error when we access to failed action data', () => {
      if (action.type === ActionType.FAILED) {
        action.response.data.message
      }
    })
  })
})
