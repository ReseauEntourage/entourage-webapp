import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'
import { useQueryMyFeeds } from 'src/core/store'
import { ConversationDetail } from './ConversationDetail'
import { ConversationsList } from './ConversationsList'
import * as S from './Messages.styles'
import { useEntourageId } from './useEntourageId'

export function MessagesMobile() {
  const entourageId = useEntourageId()
  const { data: dataMyFeeds } = useQueryMyFeeds()

  if (!dataMyFeeds) {
    return (
      <Box alignItems="center" display="flex" height="100%" justifyContent="center">
        <CircularProgress variant="indeterminate" />
      </Box>
    )
  }

  return (
    <S.Container>
      {entourageId ? <ConversationDetail key={entourageId} entourageId={entourageId} /> : <ConversationsList />}
    </S.Container>
  )
}
