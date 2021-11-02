import { Typography } from '@material-ui/core'
import React from 'react'
import { Notifications } from 'src/components/Notifications'
import { LayoutProvider } from 'src/containers/LayoutContext'
import { DrawerNav } from 'src/containers/Nav'
import { variants } from 'src/styles'
import * as S from './Layout.styles'

export function Layout(props: { children: JSX.Element;}) {
  const { children } = props

  return (
    <LayoutProvider>
      <Typography component="div" variant={variants.bodyRegular}>
        <S.Main>{children}</S.Main>
        <DrawerNav />
        <Notifications />
      </Typography>
    </LayoutProvider>
  )
}

Layout.Nav = S.Nav
Layout.Page = S.Page
