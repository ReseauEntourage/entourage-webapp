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
import {
  messagesActions,
  selectConversationList,
  selectConversationsIsFetching,
  selectMessagesCurrentPage,
} from 'src/core/useCases/messages'
import { useMeNonNullable } from 'src/hooks/useMe'
import { useOnScroll } from 'src/utils/hooks'
import { ConversationItemExcerpt } from './ConversationItemExcerpt'
import * as S from './ConversationsList.styles'

interface ConversationsListProps {
  entourageUuid?: string;
}

export function ConversationsList(props: ConversationsListProps) {
  const { entourageUuid } = props
  const conversations = useSelector(selectConversationList)
  const conversationsFetching = useSelector(selectConversationsIsFetching)
  const currentPage = useSelector(selectMessagesCurrentPage)

  const dispatch = useDispatch()
  const me = useMeNonNullable()
  const { entouragesWithMembers: entouragesWithMembersPending } = useQueryEntouragesWithMembers('pending')

  const { onScroll } = useOnScroll({
    onScrollBottomEnd: () => {
      dispatch(messagesActions.retrieveNextConversations())
    },
  })

  if (conversationsFetching && currentPage === 1) {
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

        const entourageWithMembers = entouragesWithMembersPending?.find((entourage) => {
          return entourage.entourageUuid === conversationUuid
        })

        const pendingMembers = entourageWithMembers?.members ?? []

        const iAmAuthor = conversation.author.id === me.id

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
                      iAmAuthor={iAmAuthor}
                      pendingMembers={pendingMembers}
                      text={conversation.lastMessage?.text ?? ''}
                    />
                  )}
                  hasUnreadMessages={conversation.numberOfUnreadMessages > 0}
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
