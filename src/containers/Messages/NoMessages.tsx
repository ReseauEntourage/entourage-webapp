import { Box, Typography } from '@material-ui/core'
import React from 'react'
import { texts } from 'src/i18n'
import { variants } from 'src/styles'

export function NoMessages() {
  return (
    <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center" padding={3} width="100%">
      <img
        alt="Personnage"
        src="/personnage-dialogue-2.png"
        width="75"
      />
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        marginBottom={2}
        marginTop={3}
        width="100%"
      >
        <Typography align="center" variant={variants.title1}>
          {texts.content.messages.noMessages.title}
        </Typography>
        <Typography align="center" variant={variants.bodyRegular}>
          {texts.content.messages.noMessages.text}
        </Typography>
      </Box>
    </Box>
  )
}
