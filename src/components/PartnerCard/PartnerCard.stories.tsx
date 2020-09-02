import React from 'react'
import { loremIpsum } from 'src/utils/misc'
import { PartnerCard } from './PartnerCard'

export default {
  title: 'PartnerCard',
  parameters: {
    component: PartnerCard,
  },
}

const partner: React.ComponentProps<typeof PartnerCard> = {
  email: 'name@partner.fr',
  phone: '0000000000',
  description: loremIpsum(150),
  name: 'Name',
  donationsNeeds: 'shoes',
  volunteersNeeds: 'local people',
  websiteUrl: 'web.fr',
  largeLogoUrl: '',
}

export const Demo = () => (
  <PartnerCard
    {...partner}
  />
)
