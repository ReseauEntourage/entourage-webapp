import { AnyCantFix } from 'src/utils/types'

function throwAssertionError(val: AnyCantFix, type: string, additionnalMessage = '') {
  throw new Error(
    `
      Assertion error: expected 'val' to be ${type}, but received ${val}
      ${additionnalMessage && `\n\n${additionnalMessage}`}
    `,
  )
}

export function assertIsString(val: AnyCantFix, message = ''): asserts val is string {
  if (typeof val !== 'string') {
    throwAssertionError(val, 'string', message)
  }
}

export function assertIsNumber(val: AnyCantFix, message = ''): asserts val is number {
  if (typeof val !== 'number') {
    throwAssertionError(val, 'number', message)
  }
}

export function assertIsBoolean(val: AnyCantFix, message = ''): asserts val is boolean {
  if (typeof val !== 'boolean') {
    throwAssertionError(val, 'boolean', message)
  }
}

export function assertIsDefined<T>(val: T, message = ''): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throwAssertionError(val, 'defined', message)
  }
}
