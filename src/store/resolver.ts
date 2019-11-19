import { Resolver } from 'react-resources-store'

interface Args {
  resourceType: string;
  requestKey: string;
}

export const resolver: Resolver = (args: Args) => {
  return {
    method: 'GET',
    requestKey: args.requestKey,
    resourceType: args.resourceType,
    resourceId: '',
    request: () => {},
  }
}
