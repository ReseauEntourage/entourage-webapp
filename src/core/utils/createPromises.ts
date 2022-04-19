import { AnyCantFix } from 'src/utils/types'

export function createPromises<T extends { [key: string]: AnyCantFix; }>(obj: T) {
  const promises = Object.keys(obj).reduce((acc, key) => {
    return {
      ...acc,
      [key]: Promise.resolve(obj[key]),
    }
  // eslint-disable-next-line no-use-before-define
  }, {} as { [Key in keyof T]: Promise<T[Key]> })

  const all = Promise.all(Object.values(promises))

  return {
    promises,
    all,
  }
}
