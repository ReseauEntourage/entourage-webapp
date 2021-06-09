jest.mock('src/core/utils/persistReducer', () => {
  return {
    persistReducer: (key, reducer) => reducer,
  }
})

jest.mock('smartbanner.js/dist/smartbanner.min.js')
