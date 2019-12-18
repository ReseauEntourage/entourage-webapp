import CircularProgress from '@material-ui/core/CircularProgress'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { ConversationItem } from 'src/components/Conversations'
import {
  useQueryMyFeeds,
  useQueryEntouragesWithMembers,
  DataUseQueryEntouragesWithMembers,
  DataQueryMyFeeds,
} from 'src/network/queries'
import { assertIsDefined } from 'src/utils'

const Container = styled.div`
  border-right: solid 1px #ccc;
  /* TODO: responsive */
  max-width: 400px;
`

function getExcerpt(
  feed: NonNullable<DataQueryMyFeeds>['data']['feeds'][0],
  // eslint-disable-next-line
  membersData: NonNullable<DataUseQueryEntouragesWithMembers>[0]['members'],
): string {
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

  const entourageIds = dataMyFeeds?.data.feeds.map((feed) => feed.data.id)
  const { entouragesWithMembers } = useQueryEntouragesWithMembers(entourageIds, 'pending')

  if (!dataMyFeeds) {
    throw new Error('ConversationsList: feed null')
  }

  if (!entouragesWithMembers) {
    return <CircularProgress variant="indeterminate" />
  }

  return (
    <Container>
      {dataMyFeeds.data.feeds.map((feed) => {
        const entourageWithMembers = entouragesWithMembers.find((entourage) => entourage.entourageId === feed.data.id)

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
                excerpt={getExcerpt(feed, members)}
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
