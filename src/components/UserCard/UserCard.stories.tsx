/* eslint-disable max-len */
import React from 'react'
import { ModalsListener } from '../Modal'
import { UserPartnerWithDetails } from 'src/core/api'
import { ThemeProvider } from 'src/styles'
import { loremIpsum } from 'src/utils/misc'
import { UserCard } from './UserCard'

export default {
  title: 'UserCard',
  parameters: {
    component: UserCard,
  },
}

const partner: UserPartnerWithDetails = {
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
  <ThemeProvider>
    <ModalsListener />
    <UserCard
      actionsCount={2}
      conversationUuid="12"
      description={loremIpsum(150)}
      name="Name"
      partner={
        partner
      }
    />
  </ThemeProvider>
)
