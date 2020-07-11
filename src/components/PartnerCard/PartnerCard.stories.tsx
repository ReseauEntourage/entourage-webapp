/* eslint-disable max-len */
import React from 'react'
import { PartnerCard } from 'src/components/PartnerCard'
import { loremIpsum } from 'src/utils/misc'

export default {
  title: 'PartnerCard',
  parameters: {
    component: PartnerCard,
  },
}

const partner: React.ComponentProps<typeof PartnerCard> = {
  // address: loremIpsum(30),
  email: 'name@partner.fr',
  phone: '0000000000',
  description: loremIpsum(150),
  name: 'Name',
  donationsNeeds: 'shoes',
  volunteersNeeds: 'local people',
  websiteUrl: 'web.fr',
  // default: false,
  // userRoleTitle: 'test',
  smallLogoUrl: '',
  // largeLogoUrl: '',
  // id: '123',
}

export const Demo = () => (
  <PartnerCard
    {...partner}
  />
)
