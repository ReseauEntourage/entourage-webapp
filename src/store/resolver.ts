import { Resolver } from 'react-resources-store'

export function resolver(fnResolver: Resolver) {
  return fnResolver()
}
