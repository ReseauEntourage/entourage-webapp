import IconInfo from '@material-ui/icons/Info'
import React from 'react'
import * as S from './TopBar.styles'
import { TopBarProps } from '.'

export function TopBarDesktop(props: TopBarProps) {
  const { title, onClickTopBar } = props
  return (
    <S.TopBarContainer onClick={onClickTopBar}>
      <S.TopBarTypography>
        {title}
      </S.TopBarTypography>
      <S.Icon>
        <IconInfo color="primary" />
      </S.Icon>
    </S.TopBarContainer>
  )
}
