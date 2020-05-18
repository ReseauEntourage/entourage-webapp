import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { TopBarContainer, TopBarTypography } from './TopBar.styles'
import { TopBarProps } from '.'

export function TopBarMobile(props: TopBarProps) {
  const { title } = props
  const router = useRouter()

  const onClickBack = useCallback(() => router.push('/messages'), [router])

  return (
    <TopBarContainer>
      <IconButton onClick={onClickBack}>
        <ChevronLeftIcon />
      </IconButton>
      <TopBarTypography>
        {title}
      </TopBarTypography>
    </TopBarContainer>
  )
}