import { Box, Typography } from '@material-ui/core'
import React from 'react'
import { variants } from 'src/styles'

export function NoContent({ text }: { text: string; }) {
  return (
    <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center" padding={3}>
      <Typography align="center" variant={variants.bodyRegular}>
        {text}
      </Typography>
    </Box>
  )
}
