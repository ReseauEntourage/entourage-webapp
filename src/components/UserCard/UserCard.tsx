import React from 'react'
import { Avatar } from 'src/components/Avatar'
import { Button } from 'src/components/Button'
import { ExtendedUserPartner } from 'src/core/api'

import { PartnerCard } from './PartnerCard'
import * as S from './UserCard.styles'

interface UserCardProps {
  actionsCount: number;
  allowContact?: boolean;
  allowReport?: boolean;
  avatarURL?: string;
  conversationUuid: string;
  description: string;
  name: string;
  partner?: ExtendedUserPartner;
}

// TODO : i18n
export function UserCard(props: UserCardProps) {
  const {
    name,
    conversationUuid,
    allowContact = false,
    allowReport = false,
    avatarURL,
    description,
    actionsCount,
    partner,
  } = props

  const [partnerCardIsOpen, setPartnerCardIsOpen] = React.useState(false)

  if (partnerCardIsOpen && partner) {
    return <PartnerCard onClickBack={() => setPartnerCardIsOpen(false)} partner={props.partner} />
  }

  const partnerName = partner?.name
  const partnerAvatarURL = partner?.smallLogoUrl

  return (
    <S.Container>
      <S.Avatar>
        <Avatar size="large" src={avatarURL} />
      </S.Avatar>
      <S.Name>{name}</S.Name>
      {description && (
        <S.Description>{description}</S.Description>
      )}
      <S.Actions>
        <S.SectionTitle>Actions</S.SectionTitle>
        {actionsCount} actions créées
      </S.Actions>
      {partnerName && (
        <S.Organization>
          <S.SectionTitle>Association</S.SectionTitle>
          <S.OrganizationDetail onClick={() => setPartnerCardIsOpen(true)}>
            <Avatar size="large" src={partnerAvatarURL} /> {partnerName}
          </S.OrganizationDetail>
        </S.Organization>
      )}
      {allowReport && (
        <S.ReportBtn>
          <Button color="secondary">Signaler</Button>
        </S.ReportBtn>
      )}
      {allowContact && (
        <S.ContactBtn>
          <Button href={`/messages/${conversationUuid}`}>Contacter</Button>
        </S.ContactBtn>
      )}
    </S.Container>
  )
}
