import SendIcon from '@material-ui/icons/Send'
import React from 'react'
import { Button } from 'src/components/Button'
import { texts } from 'src/i18n'
import { theme } from 'src/styles'
import { SendButtonProps } from '.'

export function SendButtonDesktop(props: SendButtonProps) {
  const { onClick, disabled = false } = props
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      startIcon={<SendIcon />}
      style={{ marginLeft: theme.spacing(2) }}
    >
      {texts.content.messages.send}
    </Button>
  )
}
