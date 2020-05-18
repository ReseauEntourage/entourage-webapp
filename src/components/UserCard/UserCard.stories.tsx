/* eslint-disable max-len */
import React from 'react'
import { loremIpsum } from 'src/utils/misc'
import { UserCard } from './UserCard'

export default {
  title: 'UserCard',
  parameters: {
    component: UserCard,
  },
}

export const Demo = () => (
  <UserCard
    actionsCount={2}
    description={loremIpsum(150)}
    name="Name"
    organizationName="Cocoon"
  />
)
