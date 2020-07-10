import React from 'react'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { UserPartnerWithDetails } from 'src/core/api'
import { loremIpsum } from 'src/utils/misc'
import { ModalPartnerCard } from './ModalPartnerCard'

export default {
  title: 'ModalModalPartnerCardShare',
  parameters: {
    component: ModalPartnerCard,
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
  <TransparentWrapper>
    <ModalPartnerCard
      partner={partner}
    />
  </TransparentWrapper>
)
