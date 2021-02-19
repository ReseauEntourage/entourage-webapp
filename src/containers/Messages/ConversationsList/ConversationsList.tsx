import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Link from 'next/link'
import React from 'react'
import { ConversationItem } from 'src/components/Conversations'
import {
  useQueryMyFeeds,
  useQueryEntouragesWithMembers,
} from 'src/core/store'
import { useMeNonNullable } from 'src/hooks/useMe'
import { assertIsDefined } from 'src/utils/misc'
import { ConversationItemExcerpt } from './ConversationItemExcerpt'
import * as S from './ConversationsList.styles'

interface ConversationsListProps {
  entourageUuid?: string;
}

export function ConversationsList(props: ConversationsListProps) {
  const { entourageUuid } = props
  const { data: dataMyFeeds } = useQueryMyFeeds()
  const me = useMeNonNullable()
  const { entouragesWithMembers: entouragesWithMembersPending } = useQueryEntouragesWithMembers('pending')

  if (!dataMyFeeds) {
    // can't null because it's already fetch in a parent Component
    assertIsDefined(dataMyFeeds, 'ConversationsList: feed can\'t be null')
  }

  if (!entouragesWithMembersPending) {
    return (
      <S.Container>
        <Box alignItems="center" display="flex" height="100%" justifyContent="center">
          <CircularProgress variant="indeterminate" />
        </Box>
      </S.Container>
    )
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

          const pendingMembers = entourageWithMembers?.members ?? []

          return (
            <S.ListItem
              key={feedUuid}
            >
              <Link
                as={`/messages/${feedUuid}`}
                href="/messages/[messageId]"
              >
                <a>
                  <ConversationItem
                    excerpt={(
                      <ConversationItemExcerpt
                        feedJoinStatus={feed.data.joinStatus}
                        iAmAuthor={feed.data.author.id === me.id}
                        pendingMembers={pendingMembers}
                        text={feed.data.lastMessage?.text ?? ''}
                      />
                    )}
                    isActive={feedUuid === entourageUuid}
                    profilePictureURL={feed.data.author.avatarUrl}
                    title={feed.data.title}
                  />
                </a>
              </Link>
            </S.ListItem>
          )
        })}
    </S.Container>
  )
}
