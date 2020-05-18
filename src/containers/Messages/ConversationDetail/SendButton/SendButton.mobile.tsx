import SendIcon from '@material-ui/icons/Send'
import React from 'react'
import { Button } from 'src/components/Button'
import { theme } from 'src/styles'
import { SendButtonProps } from '.'

export function SendButtonMobile(props: SendButtonProps) {
  const { onClick } = props
  return (
    <Button
      onClick={onClick}
      style={{ marginLeft: theme.spacing(2) }}
    >
      <SendIcon />
    </Button>
  )
}
