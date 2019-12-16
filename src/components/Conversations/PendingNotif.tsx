import Typography from '@material-ui/core/Typography'
import React from 'react'
import styled from 'styled-components'
import { Avatar } from 'src/components/Avatar'
import { theme, colors, variants } from 'src/styles'

const Container = styled.div`
  background-color: ${colors.main.second};
  display: flex;
  align-items: center;
  padding: ${theme.spacing(1)}px;
  border-radius: 5px;
`

const Label = styled(Typography).attrs(() => ({
  color: 'textSecondary',
  variant: variants.bodyRegular,
}))`
  margin-left: ${theme.spacing(1)}px !important;
`

interface PendingNotifProps {
  label: string | JSX.Element;
  pictureURL?: string | [string, string];
}

export function PendingNotif(props: PendingNotifProps) {
  const { label, pictureURL } = props

  const avatarMultipleStyles: React.CSSProperties = {
    position: 'absolute',
    width: 24,
    height: 24,
  }

  const avatar = Array.isArray(pictureURL)
    ? (
      <div style={{ width: 36, height: 36, position: 'relative' }}>
        <Avatar borderColor="white" src={pictureURL[0]} style={{ ...avatarMultipleStyles, top: 0, right: 0 }} />
        <Avatar borderColor="white" src={pictureURL[1]} style={{ ...avatarMultipleStyles, left: 0, bottom: 0 }} />
      </div>
    ) : <Avatar borderColor="white" src={pictureURL} />

  return (
    <Container>
      {avatar}
      <Label>
        {label}
      </Label>
    </Container>
  )
}
