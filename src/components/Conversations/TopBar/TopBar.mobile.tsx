import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import IconInfo from '@material-ui/icons/Info'
import React from 'react'
import * as S from './TopBar.styles'
import { TopBarProps } from '.'

export function TopBarMobile(props: TopBarProps) {
  const { title, onClickBackToMessages, onClickTopBar } = props

  return (
    <S.TopBarContainer>
      <IconButton onClick={onClickBackToMessages}>
        <ChevronLeftIcon />
      </IconButton>
      <S.TopBarTypography onClick={onClickTopBar}>
        {title}
      </S.TopBarTypography>
      <S.Icon onClick={onClickTopBar}>
        <IconInfo color="primary" />
      </S.Icon>
    </S.TopBarContainer>
  )
}
