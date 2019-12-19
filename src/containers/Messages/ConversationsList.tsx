import CircularProgress from '@material-ui/core/CircularProgress'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { ConversationItem, PendingNotif } from 'src/components/Conversations'
import {
  useQueryMyFeeds,
  useQueryEntouragesWithMembers,
  useQueryMeNonNullable,
  DataUseQueryEntouragesWithMembers,
  DataQueryMyFeeds,
  DataUseQueryMeNonNullable,
} from 'src/core/queries'
import { assertIsDefined } from 'src/utils/misc'

const Container = styled.div`
  border-right: solid 1px #ccc;
  /* TODO: responsive */
  max-width: 400px;
`

function getExcerpt(
  me: DataUseQueryMeNonNullable,
  feed: NonNullable<DataQueryMyFeeds>['data']['feeds'][0],
  pendingMembers: NonNullable<DataUseQueryEntouragesWithMembers>[0]['members'],
): string | JSX.Element {
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
    return feed.data.description
  }

  if (feed.data.joinStatus === 'pending') {
    return 'Votre demande est en attente'
  }

  return ''
}

interface ConversationsList {
  entourageId?: number;
}

export function ConversationsList(props: ConversationsList) {
  const { entourageId } = props
  const { data: dataMyFeeds } = useQueryMyFeeds()
  const me = useQueryMeNonNullable()
  const { entouragesWithMembers: entouragesWithMembersPending } = useQueryEntouragesWithMembers('pending')

  if (!dataMyFeeds) {
    // can't null because it's already fetch in a parent Component
    assertIsDefined(dataMyFeeds, 'ConversationsList: feed can\'t be null')
  }

  if (!entouragesWithMembersPending) {
    return <CircularProgress variant="indeterminate" />
  }

  return (
    <Container>
      {dataMyFeeds.data.feeds
        .filter((feed) => feed.data.joinStatus === 'accepted' || feed.data.joinStatus === 'pending')
        .map((feed) => {
          const entourageWithMembers = entouragesWithMembersPending.find((entourage) => {
            return entourage.entourageId === feed.data.id
          })

          assertIsDefined(entourageWithMembers)

          const { members } = entourageWithMembers
          return (
            <Link
              key={feed.data.id}
              as={`/messages/${feed.data.id}`}
              href="/messages/[messageId]"
            >
              <a>
                <ConversationItem
                  excerpt={getExcerpt(me, feed, members)}
                  isActive={entourageId === feed.data.id}
                  title={feed.data.title}
                />
              </a>
            </Link>
          )
        })}
    </Container>
  )
}
