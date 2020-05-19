import SendIcon from '@material-ui/icons/Send'
import React from 'react'
import { Button } from 'src/components/Button'
import { theme } from 'src/styles'
import { SendButtonProps } from '.'

export function SendButtonDesktop(props: SendButtonProps) {
  const { onClick } = props
  return (
    <Button
      onClick={onClick}
      startIcon={<SendIcon />}
      style={{ marginLeft: theme.spacing(2) }}
    >
      Envoyer
    </Button>
  )
}
