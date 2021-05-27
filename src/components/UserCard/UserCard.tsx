import Link from 'next/link'
import React from 'react'
import { Avatar } from 'src/components/Avatar'
import { Button } from 'src/components/Button'
import { openModal, useModalContext } from 'src/components/Modal'
import { ModalPartnerCard } from 'src/components/ModalPartnerCard'
import { PartnerCard } from 'src/components/PartnerCard'
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

  const { onClose } = useModalContext()

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
            <Avatar size="large" src={partner.largeLogoUrl} /> {partner?.name}
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
          <Link as={`/messages/${conversationUuid}`} href="/messages/[messagesId]">
            <Button onClick={onClose}>Contacter</Button>
          </Link>
        </S.ContactBtn>
      )}
    </S.Container>
  )
}
