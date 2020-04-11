import { Typography } from '@material-ui/core'
import { useWindowWidth } from '@react-hook/window-size'
import React from 'react'
import { Provider as LayoutContextProvider } from 'src/containers/LayoutContext'
import { DrawerNav } from 'src/containers/Nav'
import { variants, breakpoints } from 'src/styles'
import { Main, Page, Nav } from './Layout.styles'

export function Layout(props: { children: JSX.Element;}) {
  const { children } = props
  const windowWidth = useWindowWidth()
  const isMobile = windowWidth < breakpoints.mobile

  return (
    <LayoutContextProvider>
      <Typography component="div" variant={variants.bodyRegular}>
        <Main>{children}</Main>
        {isMobile && <DrawerNav />}
      </Typography>
    </LayoutContextProvider>
  )
}

Layout.Nav = Nav
Layout.Page = Page
