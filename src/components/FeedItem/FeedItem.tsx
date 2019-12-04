import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import { Container /* , AvatarNumber */ } from './FeedItem.styles'

interface Props {
  isActive?: boolean;
  primaryText: string;
  profilePictureURL?: string;
  secondText: string;
}

export function FeedItem(props: Props) {
  const {
    primaryText,
    secondText,
    isActive,
    profilePictureURL,
  } = props

  const primaryTextCropped = primaryText.length < 100
    ? primaryText
    : `${primaryText.substring(0, 100)}...`

  return (
    <Container isActive={isActive}>
      <div>
        <Typography variant="subtitle2">
          {primaryTextCropped}
        </Typography>
        <Typography variant="caption">{secondText}</Typography>
      </div>
      <Box flexGrow="1" />
      <Box display="flex">
        <Avatar alt="John Doe" src={profilePictureURL} />
        {/* <AvatarNumber /> */}
      </Box>
    </Container>
  )
}
