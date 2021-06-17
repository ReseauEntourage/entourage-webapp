import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { Avatar } from 'src/components/Avatar'
import { Button } from 'src/components/Button'
import { Link as CustomLink } from 'src/components/Link'
import { openModal, useModalContext } from 'src/components/Modal'
import { ModalPartnerCard } from 'src/components/ModalPartnerCard'
import { PartnerCard } from 'src/components/PartnerCard'
import { ModalSignIn } from 'src/containers/ModalSignIn'
import { useMe } from 'src/hooks/useMe'
import * as S from './UserCard.styles'

interface UserCardProps {
  actionsCount: number;
  allowContact?: boolean;
  allowReport?: boolean;
  avatarURL?: string;
  conversationUuid?: string;
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

  const me = useMe()
  const router = useRouter()

  const goToConversation = useCallback(() => {
    router.push('/messages/[messagesId]', `/messages/${conversationUuid}`)
    onClose()
  }, [conversationUuid, onClose, router])

  const onClickContactButton = useCallback(() => {
    if (!me) {
      openModal(<ModalSignIn onSuccess={goToConversation} />)
    } else {
      goToConversation()
    }
  }, [goToConversation, me])

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
      {allowContact && conversationUuid && (
        <S.ContactBtn>
          <CustomLink>
            <Button onClick={onClickContactButton}>Contacter</Button>
          </CustomLink>
        </S.ContactBtn>
      )}
    </S.Container>
  )
}
