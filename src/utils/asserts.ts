import { AnyCantFix } from 'src/types'

export function assertIsString(val: AnyCantFix): val is string {
  return typeof val === 'string'
}

export function assertIsNumber(val: AnyCantFix): val is number {
  return typeof val === 'number'
}

export function assertIsBoolean(val: AnyCantFix): val is boolean {
  return typeof val === 'boolean'
}

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(
      `Expected 'val' to be defined, but received ${val}`,
    )
  }
}
