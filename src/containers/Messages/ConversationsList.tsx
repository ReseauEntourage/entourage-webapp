import CircularProgress from '@material-ui/core/CircularProgress'
import Link from 'next/link'
import React from 'react'
import { ConversationItem } from 'src/components/Conversations'
import {
  useQueryMyFeeds,
  useQueryEntouragesWithMembers,
  useQueryMeNonNullable,
} from 'src/core/store'
import { assertIsDefined } from 'src/utils/misc'
import { ConversationItemExcerpt } from './ConversationItemExcerpt'
import { Container } from './ConversationsList.styles'

interface ConversationsListProps {
  entourageId?: number;
}

export function ConversationsList(props: ConversationsListProps) {
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
      {dataMyFeeds
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
                  excerpt={<ConversationItemExcerpt feed={feed} me={me} pendingMembers={members} />}
                  isActive={feed.data.id === entourageId}
                  title={feed.data.title}
                />
              </a>
            </Link>
          )
        })}
    </Container>
  )
}
