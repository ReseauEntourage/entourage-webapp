import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { ConversationItem } from 'src/components/Conversations'
import { useQueryMyFeeds } from 'src/network/queries'

const Container = styled.div`
  border-right: solid 1px #ccc;
  /* TODO: responsive */
  max-width: 400px;
`

interface ConversationsList {
  entourageId?: number;
}

export function ConversationsList(props: ConversationsList) {
  const { entourageId } = props
  const { data: dataMyFeeds } = useQueryMyFeeds()

  if (!dataMyFeeds) {
    throw new Error('ConversationsList: feed null')
  }

  return (
    <Container>
      {dataMyFeeds.data.feeds.map((feed) => (
        <Link
          key={feed.data.id}
          as={`/messages/${feed.data.id}`}
          href="/messages/[messageId]"
        >
          <a>
            <ConversationItem
              excerpt={feed.data.description}
              isActive={entourageId === feed.data.id}
              title={feed.data.title}
            />
          </a>
        </Link>
      ))}
    </Container>
  )
}
