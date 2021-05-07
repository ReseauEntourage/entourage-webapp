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
  primaryText: string;
  profilePictureURL?: string;
  secondText: string;
  numberOfPeople: number;
}

export function FeedEntourage(props: FeedEntourageProps) {
  const {
    primaryText,
    secondText,
    isActive,
    profilePictureURL,
    icon,
    numberOfPeople,
  } = props

  const primaryTextCropped = primaryText.length < 100
    ? primaryText
    : `${primaryText.substring(0, 100)}...`

  return (
    <S.Container isActive={isActive}>
      <div>
        <S.TitleContainer>
          {icon}
          <Typography variant="subtitle2">
            {primaryTextCropped}
          </Typography>
        </S.TitleContainer>
        <Box marginTop={1}>
          <Typography variant="caption">
            {secondText}
          </Typography>
        </Box>
      </div>
      <Box flexGrow="1" />
      <Box alignItems="flex-end" display="flex" flexDirection="column" justifyContent="center">
        <S.NumberContainer>
          <S.NumberIcon
            component={People}
            viewBox="0 0 58 50"
          />
          <Box>
            <Typography variant={variants.footNote}>{numberOfPeople}</Typography>
          </Box>
        </S.NumberContainer>
        <Avatar alt="Profile" src={profilePictureURL} />
      </Box>
    </S.Container>
  )
}
