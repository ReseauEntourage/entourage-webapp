import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ConversationItem } from 'src/components/Conversations'
import { Link as CustomLink } from 'src/components/Link'
import {
  useQueryEntouragesWithMembers,
} from 'src/core/store'
import { messagesActions, selectConversationList } from 'src/core/useCases/messages'
import { useMeNonNullable } from 'src/hooks/useMe'
import { useOnScroll } from 'src/utils/hooks'
import { assertIsDefined } from 'src/utils/misc'
import { ConversationItemExcerpt } from './ConversationItemExcerpt'
import * as S from './ConversationsList.styles'

interface ConversationsListProps {
  entourageUuid?: string;
}

export function ConversationsList(props: ConversationsListProps) {
  const { entourageUuid } = props
  const conversations = useSelector(selectConversationList)
  const dispatch = useDispatch()
  const me = useMeNonNullable()
  const { entouragesWithMembers: entouragesWithMembersPending } = useQueryEntouragesWithMembers('pending')

  const { onScroll } = useOnScroll({
    onScrollBottomEnd: () => {
      dispatch(messagesActions.retrieveNextConversations())
    },
  })

  if (!conversations) {
    // can't null because it's already fetch in a parent Component
    assertIsDefined(conversations, 'ConversationsList: conversations can\'t be null')
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

  const conversationList = (
    conversations
      .filter((conversation) => conversation.joinStatus === 'accepted'
            || conversation.joinStatus === 'pending')
      .map((conversation) => {
        const conversationUuid = conversation.uuid

        const entourageWithMembers = entouragesWithMembersPending.find((entourage) => {
          return entourage.entourageUuid === conversationUuid
        })

        const pendingMembers = entourageWithMembers?.members ?? []

        return (
          <S.ListItem
            key={conversationUuid}
          >
            <Link
              as={`/messages/${conversationUuid}`}
              href="/messages/[messageId]"
              passHref={true}
            >
              <CustomLink disableHover={true} style={{ width: '100%' }}>
                <ConversationItem
                  excerpt={(
                    <ConversationItemExcerpt
                      feedJoinStatus={conversation.joinStatus}
                      iAmAuthor={conversation.author.id === me.id}
                      pendingMembers={pendingMembers}
                      text={conversation.lastMessage?.text ?? ''}
                    />
                  )}
                  isActive={conversationUuid === entourageUuid}
                  profilePictureURL={conversation.author.avatarUrl}
                  title={conversation.title}
                />
              </CustomLink>
            </Link>
          </S.ListItem>
        )
      })
  )

  return (
    <S.Container
      onScroll={onScroll}
    >
      {conversationList}
    </S.Container>

  )
}
