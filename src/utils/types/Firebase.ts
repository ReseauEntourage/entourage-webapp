import { toCamelCase } from 'src/utils/misc'

export const FirebaseEvents = [
  'Action__Workshop__Dismiss',
  'Action__Workshop__Participate',
  'Action__Workshop__Show',
] as const

// TODO use Template Literals type on TypeScript 4.2.2
// https://entourage-asso.atlassian.net/browse/EN-3524

export type FirebaseEvent = typeof FirebaseEvents[number]

export const FirebaseEventFunctions = FirebaseEvents.map((event) => {
  return toCamelCase(`send_${event}`)
})

export type FirebaseEventFunction = typeof FirebaseEventFunctions[number]

export type FirebaseProps = Record<string, string>
