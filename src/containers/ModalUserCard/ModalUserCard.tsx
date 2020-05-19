import React from 'react'
import { Modal } from 'src/components/Modal'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { UserCard } from 'src/components/UserCard'
import { useQueryUser } from 'src/core/store'
import { assertIsDefined } from 'src/utils/misc'

interface ModalUserCardProps {
  userId: number;
}

export function ModalUserCard(props: ModalUserCardProps) {
  const { userId } = props
  const { data, isLoading } = useQueryUser(userId)

  const user = data?.data.user

  if (isLoading || !user) {
    return (
      <Modal cancel={false} title="" validate={false}>
        <OverlayLoader />
      </Modal>
    )
  }

  assertIsDefined(user)

  return (
    <Modal
      cancel={false}
      showCloseButton={true}
      title={user.displayName}
      validate={false}
    >
      <UserCard
        actionsCount={user.stats.entourageCount}
        avatarURL={user.avatarUrl}
        conversationUuid={user.conversation.uuid}
        description={user.about}
        name={user.displayName}
        organizationAvatarURL={user.organization?.logoUrl}
        organizationName={user.organization?.name}
      />
    </Modal>
  )
}
