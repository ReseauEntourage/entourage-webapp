import { Fade } from '@material-ui/core'
import React from 'react'
import * as S from './SplashScreen.styles'

interface SplashScreenProps {
  in?: boolean;
}

export function SplashScreen(props: SplashScreenProps) {
  const { in: fade } = props

  const content = (
    <S.Container>
      <S.AnimatedContainer>
        <S.Logo alt="Logo Entourage" src="/logo-entourage.png" />
      </S.AnimatedContainer>
    </S.Container>
  )

  if (fade !== undefined) {
    return (
      <Fade in={fade} timeout={{ appear: 0, enter: 0, exit: 1000 }}>
        {content}
      </Fade>
    )
  }
  return content
}
