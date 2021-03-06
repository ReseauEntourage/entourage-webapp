import React from 'react'
import { Modal } from 'src/components/Modal'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { UserCard } from 'src/components/UserCard'
import { useQueryUser } from 'src/core/store'
import { useMe } from 'src/hooks/useMe'
import { assertIsDefined } from 'src/utils/misc'

interface ModalUserCardProps {
  userId: number;
}

export function ModalUserCard(props: ModalUserCardProps) {
  const { userId } = props
  const { data, isLoading } = useQueryUser(userId)
  const me = useMe()

  const userIsMe = me?.id === userId

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
        allowContact={!userIsMe}
        allowReport={!userIsMe}
        avatarURL={user.avatarUrl}
        conversationUuid={user?.conversation?.uuid}
        description={user.about}
        name={user.displayName}
        partner={user?.partner}
      />
    </Modal>
  )
}
