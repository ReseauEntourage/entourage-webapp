import IconLink from '@material-ui/icons/Link'
import IconMail from '@material-ui/icons/Mail'
import IconPhone from '@material-ui/icons/Phone'
import React from 'react'
import { Avatar } from 'src/components/Avatar'
import * as S from './PartnerCard.styles'

interface PartnerCardProps {
  description: string;
  donationsNeeds: string;
  email: string;
  largeLogoUrl: string;
  name: string;
  phone: string;
  volunteersNeeds: string;
  websiteUrl: string;
}

export function PartnerCard(props: PartnerCardProps) {
  const {
    name,
    largeLogoUrl,
    description,
    email,
    phone,
    websiteUrl,
    donationsNeeds,
    volunteersNeeds,
  } = props

  return (
    <S.Container>
      <S.Avatar>
        <Avatar size="large" src={largeLogoUrl} />
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
      <S.Phone>
        <IconPhone />
        <div>{phone}</div>
      </S.Phone>
      <S.Mail>
        <IconMail />
        <div>{email}</div>
      </S.Mail>
      <S.Website>
        <IconLink />
        <div>{websiteUrl}</div>
      </S.Website>
    </S.Container>
  )
}
