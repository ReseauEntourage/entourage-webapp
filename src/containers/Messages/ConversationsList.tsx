import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { ConversationItem } from 'src/components/Conversations'
import { useQueryMyFeeds, useQueryEntourageUserRequestsList, DataQueryMyFeeds } from 'src/network/queries'
import { AnyToFix } from 'src/types'

const Container = styled.div`
  border-right: solid 1px #ccc;
  /* TODO: responsive */
  max-width: 400px;
`

// eslint-disable-next-line
function getExcerpt(feed: NonNullable<DataQueryMyFeeds>['data']['feeds'][0], membersData: AnyToFix): string {

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
  const [entourageUserRequests] = useQueryEntourageUserRequestsList(entourageIds)

  if (!dataMyFeeds) {
    throw new Error('ConversationsList: feed null')
  }

  return (
    <Container>
      {dataMyFeeds.data.feeds.map((feed) => {
        const usersData = entourageUserRequests.find((data) => data.entourageId === feed.data.id)
        return (
          <Link
            key={feed.data.id}
            as={`/messages/${feed.data.id}`}
            href="/messages/[messageId]"
          >
            <a>
              <ConversationItem
                excerpt={getExcerpt(feed, usersData?.users)}
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
