import Typography from '@material-ui/core/Typography'
import React from 'react'
import styled from 'styled-components'
import { Avatar } from 'src/components/Avatar'
import { theme, colors, variants } from 'src/styles'

const Container = styled.div`
  margin: ${theme.spacing(2)}px;
  background-color: ${colors.main.second};
  display: flex;
  padding: ${theme.spacing(1)}px;
  border-radius: 5px;
`

const Label = styled(Typography).attrs(() => ({
  component: 'div',
  variant: variants.bodyRegular,
}))`
  color: #fff !important;
`

interface PendingNotifProps {
  label: string | JSX.Element;
  pictureURL?: string | [string, string];
}

export function PendingNotif(props: PendingNotifProps) {
  const { label, pictureURL } = props

  const avatar = Array.isArray(pictureURL)
    ? null
    : <Avatar src={pictureURL} />

  return (
    <Container>
      {avatar}
      <Label>
        {label}
      </Label>
    </Container>
  )
}
