import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { Skeleton } from '@material-ui/lab'
import React from 'react'
import { variants } from 'src/styles'
import * as S from './LeftListItemSkeleton.styles'

export function LeftListItemSkeleton() {
  return (
    <S.Container>
      <Box flexGrow="1">
        <S.TitleContainer>
          <Skeleton height={22} variant="circle" width={22} />
          <Typography variant={variants.title2}>
            <Skeleton variant="text" width={200} />
            <Skeleton variant="text" width={150} />
          </Typography>
        </S.TitleContainer>
        <Box marginTop={1}>
          <Typography variant={variants.bodyRegular}>
            <Skeleton variant="text" width={120} />
          </Typography>
        </Box>
        <Box marginTop={1}>
          <Typography variant={variants.footNote}>
            <Skeleton variant="text" width={90} />
          </Typography>
        </Box>
      </Box>
      <Box flexGrow="1" />
      <Box alignItems="flex-end" display="flex" flexDirection="column" justifyContent="center">
        <Skeleton height={40} variant="circle" width={40} />
      </Box>
    </S.Container>
  )
}
