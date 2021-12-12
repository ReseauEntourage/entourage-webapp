import { AnyCantFix } from 'src/utils/types'
import { Defer } from './Defer'

type ResolvedValue<T> = T extends PromiseLike<infer U> ? U | T : never;

export function jestFn<Fn extends(...args: AnyCantFix) => AnyCantFix>(fnKey: string) {
  const baseOutput = jest.fn<ReturnType<Fn>, Parameters<Fn>>(() => {
    throw new Error(`Method ${fnKey} is not defined. Use mockReturnValue or other Jest mock`)
  })

  type BaseOuput = typeof baseOutput;
  type Output = BaseOuput & {
    mockDeferredValue(value: ResolvedValue<ReturnType<Fn>>): void;
    mockDeferredValueOnce(value: ResolvedValue<ReturnType<Fn>>): void;
    resolveDeferredValue(): void;
    rejectDeferredValue(rejectedData?: AnyCantFix): void;
  }

  const output: Output = baseOutput as Output

  let deferred: Defer<ResolvedValue<ReturnType<Fn>>>

  output.mockDeferredValue = (value: ResolvedValue<ReturnType<Fn>>) => {
    deferred = new Defer(() => value)
    // @ts-expect-error conflict with ResolvedValue<ReturnType<Fn>>
    output.mockReturnValue(deferred.promise)
  }

  output.mockDeferredValueOnce = (value: ResolvedValue<ReturnType<Fn>>) => {
    deferred = new Defer(() => value)
    // @ts-expect-error conflict with ResolvedValue<ReturnType<Fn>>
    output.mockReturnValueOnce(deferred.promise)
  }

  output.resolveDeferredValue = () => {
    if (!deferred) {
      throw new Error('You should use mockDeferredValue() before resolveDeferredValue()')
    }

    deferred.resolve()
  }

  output.rejectDeferredValue = (rejectedData?: AnyCantFix) => {
    if (!deferred) {
      throw new Error('You should use mockDeferredValue() before rejectDeferredValue()')
    }

    deferred.reject(rejectedData)
  }

  return output
}
