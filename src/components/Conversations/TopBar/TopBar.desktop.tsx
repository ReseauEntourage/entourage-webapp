import React from 'react'
import { TopBarContainer, TopBarTypography } from './TopBar.styles'
import { TopBarProps } from '.'

export function TopBarDesktop(props: TopBarProps) {
  const { title } = props
  return (
    <TopBarContainer>
      <TopBarTypography>
        {title}
      </TopBarTypography>
    </TopBarContainer>
  )
}
