import { env } from 'src/core/env'
import { Client } from './Client'
import { createResource } from './createResource'

const client = new Client(env.API_V1_URL)

export const api = {
  anonymousUser: createResource(client, 'POST anonymous_users'),
  myFeeds: createResource(client, 'GET myfeeds'),
  userMeGet: createResource(client, 'GET users/me'),
}
