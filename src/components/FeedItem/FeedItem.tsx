import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { Avatar } from 'src/components/Avatar'
import { Container, TitleContainer /* , AvatarNumber */ } from './FeedItem.styles'

export { iconStyle } from './FeedItem.styles'

interface FeedItemProps {
  icon?: JSX.Element;
  isActive?: boolean;
  primaryText: string;
  profilePictureURL?: string;
  secondText: string;
}

export function FeedItem(props: FeedItemProps) {
  const {
    primaryText,
    secondText,
    isActive,
    profilePictureURL,
    icon,
  } = props

  const primaryTextCropped = primaryText.length < 100
    ? primaryText
    : `${primaryText.substring(0, 100)}...`

  return (
    <Container isActive={isActive}>
      <div>
        <TitleContainer>
          {icon}
          <Typography variant="subtitle2">
            {primaryTextCropped}
          </Typography>
        </TitleContainer>
        <Typography variant="caption">
          {secondText}
        </Typography>
      </div>
      <Box flexGrow="1" />
      <Box display="flex">
        <Avatar alt="Profile" src={profilePictureURL} />
        {/* <AvatarNumber /> */}
      </Box>
    </Container>
  )
}
