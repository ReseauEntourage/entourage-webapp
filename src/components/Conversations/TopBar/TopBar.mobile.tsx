import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import React from 'react'
import { TopBarContainer, TopBarTypography } from './TopBar.styles'
import { TopBarProps } from '.'

export function TopBarMobile(props: TopBarProps) {
  const { title, onClickBackToMessages } = props

  return (
    <TopBarContainer>
      <IconButton onClick={onClickBackToMessages}>
        <ChevronLeftIcon />
      </IconButton>
      <TopBarTypography>
        {title}
      </TopBarTypography>
    </TopBarContainer>
  )
}
