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
  const name = props?.partner?.name
  const smallLogoUrl = props?.partner?.smallLogoUrl
  const description = props?.partner?.description
  const email = props?.partner?.email
  const phone = props?.partner?.phone
  const websiteUrl = props?.partner?.websiteUrl
  const donationsNeeds = props?.partner?.donationsNeeds
  const volunteersNeeds = props?.partner?.volunteersNeeds

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
