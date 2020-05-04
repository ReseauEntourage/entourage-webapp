import { Typography } from '@material-ui/core'
import React from 'react'
import { Provider as LayoutContextProvider } from 'src/containers/LayoutContext'
import { DrawerNav } from 'src/containers/Nav'
import { variants } from 'src/styles'
import { Main, Page, Nav } from './Layout.styles'

export function Layout(props: { children: JSX.Element;}) {
  const { children } = props

  return (
    <LayoutContextProvider>
      <Typography component="div" variant={variants.bodyRegular}>
        <Main>{children}</Main>
        <DrawerNav />
      </Typography>
    </LayoutContextProvider>
  )
}

Layout.Nav = Nav
Layout.Page = Page
