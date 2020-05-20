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
import * as S from './ConversationsList.styles'

interface ConversationsListProps {
  entourageUuid?: string;
}

export function ConversationsList(props: ConversationsListProps) {
  const { entourageUuid } = props
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
    <S.Container>
      {dataMyFeeds
        .filter((feed) => feed.data.joinStatus === 'accepted' || feed.data.joinStatus === 'pending')
        .map((feed) => {
          const feedUuid = feed.data.uuid

          const entourageWithMembers = entouragesWithMembersPending.find((entourage) => {
            return entourage.entourageUuid === feedUuid
          })

          assertIsDefined(entourageWithMembers)

          const { members } = entourageWithMembers
          return (
            <Link
              key={feedUuid}
              as={`/messages/${feedUuid}`}
              href="/messages/[messageId]"
            >
              <a>
                <ConversationItem
                  excerpt={(
                    <ConversationItemExcerpt
                      feedJoinStatus={feed.data.joinStatus}
                      iAmAuthor={feed.data.author.id === me.id}
                      pendingMembers={members}
                      text={feed.data.lastMessage?.text ?? ''}
                    />
                  )}
                  isActive={feedUuid === entourageUuid}
                  profilePictureURL={feed.data.author.avatarUrl}
                  title={feed.data.title}
                />
              </a>
            </Link>
          )
        })}
    </S.Container>
  )
}
