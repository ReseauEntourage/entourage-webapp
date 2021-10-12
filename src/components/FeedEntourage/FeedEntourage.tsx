import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { People } from 'src/assets'
import { Avatar } from 'src/components/Avatar'
import { variants } from 'src/styles'
import * as S from './FeedEntourage.styles'

interface FeedEntourageProps {
  icon?: JSX.Element;
  isActive?: boolean;
  title: string;
  profilePictureURL: string | null;
  numberOfPeople: number;
  subtitle: React.ReactNode;
  distance: string;
  hasJoined?: boolean;
}

export function FeedEntourage(props: FeedEntourageProps) {
  const {
    title,
    isActive,
    profilePictureURL,
    icon,
    numberOfPeople,
    subtitle,
    distance,
  } = props

  const titleCropped = title.length < 100
    ? title
    : `${title.substring(0, 100)}...`

  return (
    <S.Container isActive={isActive}>
      <div>
        <S.TitleContainer>
          {icon}
          <Typography variant={variants.title2}>
            {titleCropped}
          </Typography>
        </S.TitleContainer>
        <Box marginTop={1}>
          <Typography variant={variants.footNote}>
            {subtitle}
          </Typography>
        </Box>
        <Box marginTop={1}>
          <Typography variant={variants.footNote}>
            {distance}
          </Typography>
        </Box>
      </div>
      <Box flexGrow="1" />
      <Box alignItems="flex-end" display="flex" flexDirection="column" justifyContent="center">
        <S.NumberContainer>
          <S.NumberIcon viewBox="0 0 58 50">
            <People />
          </S.NumberIcon>
          <Box>
            <Typography variant={variants.footNote}>{numberOfPeople}</Typography>
          </Box>
        </S.NumberContainer>
        <Avatar alt="Profile" src={profilePictureURL} />
      </Box>
    </S.Container>
  )
}
