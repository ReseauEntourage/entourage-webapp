import React from 'react'
import { PendingNotif } from 'src/components/Conversations'
import {
  DataUseQueryEntouragesWithMembers,
  DataQueryMyFeeds,
  DataUseQueryMeNonNullable,
} from 'src/core/store'

interface ConversationItemExcerptProps {
  feed: NonNullable<DataQueryMyFeeds>[0];
  me: DataUseQueryMeNonNullable;
  pendingMembers: NonNullable<DataUseQueryEntouragesWithMembers>[0]['members'];
}

export function ConversationItemExcerpt(props: ConversationItemExcerptProps) {
  const { me, feed, pendingMembers } = props
  const iAmAuthor = me.id === feed.data.author.id

  if (iAmAuthor && pendingMembers.length) {
    const label = pendingMembers.length > 1
      ? <div><b>Plusieurs demande en attente</b></div>
      : <div><b>{pendingMembers[0].displayName}</b> souhaite participer</div>

    const pictureURL = pendingMembers.length > 1
      ? [pendingMembers[0].avatarUrl, pendingMembers[1].avatarUrl] as [string, string]
      : pendingMembers[0].avatarUrl

    return (
      <PendingNotif
        label={label}
        pictureURL={pictureURL}
      />
    )
  }

  if (feed.data.joinStatus === 'accepted') {
    return <span>{feed.data.description}</span>
  }

  if (feed.data.joinStatus === 'pending') {
    return <span>Votre demande est en attente</span>
  }

  return null
}
