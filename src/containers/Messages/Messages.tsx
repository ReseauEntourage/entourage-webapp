import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'
import styled from 'styled-components'
import { useQueryMyFeeds } from 'src/core/store'
import { ConversationDetail } from './ConversationDetail'
import { ConversationsList } from './ConversationsList'
import { useEntourageId } from './useEntourageId'

const Container = styled.div`
  height: 100%;
  display: flex;
`

interface MessagesProps {}

export function Messages() {
  const { data: dataMyFeeds } = useQueryMyFeeds()
  const entourageId = useEntourageId()

  if (!dataMyFeeds) {
    return (
      <Box alignItems="center" display="flex" height="100%" justifyContent="center">
        <CircularProgress variant="indeterminate" />
      </Box>
    )
  }

  return (
    <Container>
      <ConversationsList entourageId={entourageId} />
      {entourageId ? <ConversationDetail entourageId={entourageId} /> : null}
    </Container>
  )
}
