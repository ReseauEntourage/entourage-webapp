import React from 'react'
import { Avatar } from 'src/components/Avatar'
import { Button } from 'src/components/Button'
import * as S from './UserCard.styles'

interface UserCardProps {
  actionsCount: number;
  avatarURL?: string;
  description: string;
  name: string;
  organizationAvatarURL?: string;
  organizationName?: string;
}

export function UserCard(props: UserCardProps) {
  const {
    name,
    avatarURL,
    description,
    actionsCount,
    organizationName,
    organizationAvatarURL,
  } = props

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
      {organizationName && (
        <S.Organization>
          <S.SectionTitle>Association</S.SectionTitle>
          <S.OrganizationDetail>
            <Avatar size="large" src={organizationAvatarURL} /> {organizationName}
          </S.OrganizationDetail>
        </S.Organization>
      )}
      <S.ReportBtn>
        <Button color="secondary">Signaler</Button>
      </S.ReportBtn>
      <S.ContactBtn>
        <Button>Contacter</Button>
      </S.ContactBtn>
    </S.Container>
  )
}
