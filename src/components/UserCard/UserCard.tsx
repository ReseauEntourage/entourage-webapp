import React from 'react'
import { openModal } from '../Modal'
import { PartnerCard } from '../PartnerCard'
import { Avatar } from 'src/components/Avatar'
import { Button } from 'src/components/Button'
import { ModalPartnerCard } from 'src/components/ModalPartnerCard'
import * as S from './UserCard.styles'

interface UserCardProps {
  actionsCount: number;
  allowContact?: boolean;
  allowReport?: boolean;
  avatarURL?: string;
  conversationUuid: string;
  description: string;
  name: string;
  partner?: React.ComponentProps<typeof PartnerCard>;
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

  const onClick = React.useCallback(() => {
    if (partner) {
      openModal(<ModalPartnerCard partner={partner} />)
    }
  }, [partner])

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
      {partner?.name && (
        <S.Organization>
          <S.SectionTitle>Association</S.SectionTitle>
          <S.OrganizationDetail clickable={!!partner} onClick={onClick}>
            <Avatar size="large" src={partner?.smallLogoUrl} /> {partner?.name}
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
