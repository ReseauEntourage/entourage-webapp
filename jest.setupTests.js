jest.mock('src/core/utils/persistReducer', () => {
  return {
    persistReducer: (key, reducer) => reducer,
  }
})
