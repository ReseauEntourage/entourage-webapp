/* eslint-disable max-len */
import React from 'react'
import { ExtendedUserPartner } from 'src/core/api'
import { loremIpsum } from 'src/utils/misc'
import { UserCard } from './UserCard'

export default {
  title: 'UserCard',
  parameters: {
    component: UserCard,
  },
}

const partner: ExtendedUserPartner = {
  address: loremIpsum(30),
  email: 'name@partner.fr',
  phone: '0000000000',
  description: loremIpsum(150),
  name: 'Name',
  donationsNeeds: 'shoes',
  volunteersNeeds: 'local people',
  websiteUrl: 'web.fr',
  default: false,
  userRoleTitle: 'test',
  smallLogoUrl: '',
  largeLogoUrl: '',
  id: '123',
}

export const Demo = () => (
  <UserCard
    actionsCount={2}
    conversationUuid="12"
    description={loremIpsum(150)}
    name="Name"
    partner={
      partner
    }
  />
)
