import { AnyCantFix } from 'src/utils/types'

export function jestFn<Fn extends(...args: AnyCantFix) => AnyCantFix>(fnKey: string) {
  return jest.fn<ReturnType<Fn>, Parameters<Fn>>(() => {
    throw new Error(`Method ${fnKey} is not defined. Use mockReturnValue or other Jest mock`)
  })
}
