import { Typography } from '@material-ui/core'
import React from 'react'
import { LayoutProvider } from 'src/containers/LayoutContext'
import { DrawerNav } from 'src/containers/Nav'
import { variants } from 'src/styles'
import { Main, Page, Nav } from './Layout.styles'

export function Layout(props: { children: JSX.Element;}) {
  const { children } = props

  return (
    <LayoutProvider>
      <Typography component="div" variant={variants.bodyRegular}>
        <Main>{children}</Main>
        <DrawerNav />
      </Typography>
    </LayoutProvider>
  )
}

Layout.Nav = Nav
Layout.Page = Page
