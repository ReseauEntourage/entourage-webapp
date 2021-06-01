import React from 'react'
import { PendingNotif } from 'src/components/Conversations'
import { FeedJoinStatus } from 'src/core/api'
import { DataUseQueryEntouragesWithMembers } from 'src/core/store'

interface ConversationItemExcerptProps {
  feedJoinStatus: FeedJoinStatus;
  iAmAuthor: boolean;
  pendingMembers: NonNullable<DataUseQueryEntouragesWithMembers>[0]['members'];
  text: string;
}

export function ConversationItemExcerpt(props: ConversationItemExcerptProps) {
  const { iAmAuthor, feedJoinStatus, pendingMembers, text } = props

  if (iAmAuthor && pendingMembers.length) {
    const label = pendingMembers.length > 1
      ? <div><b>Plusieurs demandes en attente ({pendingMembers.length})</b></div>
      : <div><b>{pendingMembers[0].displayName}</b> souhaite participer</div>

    const pictureURL = pendingMembers.length > 1
      ? [pendingMembers[0].avatarUrl, pendingMembers[1].avatarUrl] as [string, string]
      : pendingMembers[0].avatarUrl

    return (
      <PendingNotif
        label={label}
        pictureURL={pictureURL}
        userId={pendingMembers[0].id}
      />
    )
  }

  if (feedJoinStatus === 'accepted') {
    return <span>{text}</span>
  }

  if (feedJoinStatus === 'pending') {
    return <span>Votre demande est en attente</span>
  }

  return null
}
