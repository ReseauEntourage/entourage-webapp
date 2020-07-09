import IconLink from '@material-ui/icons/Link'
import IconMail from '@material-ui/icons/Mail'
import IconPhone from '@material-ui/icons/Phone'
import React from 'react'
import { Avatar } from 'src/components/Avatar'
import { UserPartnerWithDetails } from 'src/core/api'

import * as S from './PartnerCard.styles'

interface PartnerCard {
  partner?: UserPartnerWithDetails;
}

export function PartnerCard(props: PartnerCard) {
  const {
    name,
    smallLogoUrl,
    description,
    email,
    phone,
    websiteUrl,
    donationsNeeds,
    volunteersNeeds
  } = props.partner || {}

  return (
    <S.Container>
      <S.Avatar>
        <Avatar size="large" src={smallLogoUrl} />
      </S.Avatar>
      <S.Name>{name}</S.Name>
      {description && (
        <S.Description>{description}</S.Description>
      )}
      {/* <S.Actions>
        <S.SectionTitle>Actions</S.SectionTitle>
        {actionsCount} actions créées
      </S.Actions> */}
      { donationsNeeds && (
        <S.DonationsNeeds>
          <S.SectionTitle>Dons</S.SectionTitle>
          {donationsNeeds}
        </S.DonationsNeeds>
      ) }
      { volunteersNeeds && (
        <S.VolunteersNeeds>
          <S.SectionTitle>Bénévolat</S.SectionTitle>
          {volunteersNeeds}
        </S.VolunteersNeeds>
      ) }
      <S.PhoneArea>
        <IconPhone />
        {phone}
      </S.PhoneArea>
      <S.MailArea>
        <IconMail />
        {email}
      </S.MailArea>
      <S.WebsiteArea>
        <IconLink />
        {websiteUrl}
      </S.WebsiteArea>
    </S.Container>
  )
}
