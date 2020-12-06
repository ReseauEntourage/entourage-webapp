import { AnyCantFix } from 'src/utils/types'

export function createPromises<T extends { [key: string]: AnyCantFix; }>(obj: T) {
  const promises = Object.keys(obj).reduce((acc, key) => {
    return {
      ...acc,
      [key]: Promise.resolve(obj[key]),
    }
  }, {} as { [key in keyof T]: Promise<T[key]> })

  const all = Promise.all(Object.values(promises))

  return {
    promises,
    all,
  }
}
