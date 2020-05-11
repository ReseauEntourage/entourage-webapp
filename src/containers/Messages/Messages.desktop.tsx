import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useQueryMyFeeds } from 'src/core/store'
import { ConversationDetail } from './ConversationDetail'
import { ConversationsList } from './ConversationsList'
import { useEntourageId } from './useEntourageId'

const Container = styled.div`
  height: 100%;
  display: flex;
`

export function MessagesDesktop() {
  const { data: dataMyFeeds } = useQueryMyFeeds()
  const entourageId = useEntourageId()
  const router = useRouter()
  const firstConversationId = dataMyFeeds?.[0]?.data.id

  useEffect(() => {
    if (!entourageId && firstConversationId) {
      router.push(`/messages/${firstConversationId}`)
    }
  }, [entourageId, firstConversationId, router])

  const isReady = dataMyFeeds && (dataMyFeeds.length === 0 || entourageId)

  if (!isReady) {
    return (
      <Box alignItems="center" display="flex" height="100%" justifyContent="center">
        <CircularProgress variant="indeterminate" />
      </Box>
    )
  }

  return (
    <Container>
      <ConversationsList entourageId={entourageId} />
      {entourageId ? <ConversationDetail key={entourageId} entourageId={entourageId} /> : null}
    </Container>
  )
}
