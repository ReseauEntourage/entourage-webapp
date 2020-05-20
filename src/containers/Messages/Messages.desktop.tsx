import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useQueryMyFeeds } from 'src/core/store'
import { ConversationDetail } from './ConversationDetail'
import { ConversationsList } from './ConversationsList'
import * as S from './Messages.styles'
import { useEntourageUuid } from './useEntourageUuid'

export function MessagesDesktop() {
  const { data: dataMyFeeds } = useQueryMyFeeds()
  const entourageUuid = useEntourageUuid()
  const router = useRouter()
  const firstConversationId = dataMyFeeds?.[0]?.data.id

  useEffect(() => {
    if (!entourageUuid && firstConversationId) {
      router.push('/messages/[messageId]', `/messages/${firstConversationId}`)
    }
  }, [entourageUuid, firstConversationId, router])

  const isReady = dataMyFeeds && (dataMyFeeds.length === 0 || entourageUuid)

  if (!isReady) {
    return (
      <Box alignItems="center" display="flex" height="100%" justifyContent="center">
        <CircularProgress variant="indeterminate" />
      </Box>
    )
  }

  return (
    <S.Container>
      <ConversationsList entourageUuid={entourageUuid} />
      {entourageUuid ? (
        <S.ConversationDetailContainer>
          <ConversationDetail key={entourageUuid} entourageUuid={entourageUuid} />
        </S.ConversationDetailContainer>
      ) : null}
    </S.Container>
  )
}
