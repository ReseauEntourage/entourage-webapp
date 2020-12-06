import { Effect, SimpleEffect } from 'redux-saga/effects'
import { AnyCantFix } from 'src/utils/types'

type StripEffects<T> = T extends IterableIterator<infer E>
  ? E extends Effect | SimpleEffect<AnyCantFix, AnyCantFix>
    ? never
    : E
  : never;

/** Unwrap the type to be consistent with the runtime behavior of a call. */
type DecideReturn<T> = T extends Promise<infer R>
  ? R // If it's a promise, return the promised type.
  : T extends IterableIterator<AnyCantFix>
    ? StripEffects<T> // If it's a generator, strip any effects to get the return type.
    : T; // Otherwise, it's a normal function and the return type is unaffected.

/** Determine the return type of yielding a call effect to the provided function.
 *
 * Usage: const foo: CallReturnType&lt;typeof func&gt; = yield call(func, ...)
 */
export type CallReturnType<T extends (...args: AnyCantFix[]) => AnyCantFix> = DecideReturn<ReturnType<T>>;
