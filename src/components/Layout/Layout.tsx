import { Typography } from '@material-ui/core'
import { useWindowWidth } from '@react-hook/window-size'
import React from 'react'
import { DrawerNav } from 'src/containers/Nav'
import { variants, breakpoints } from 'src/styles'
import { Main, Page, Nav } from './Layout.styles'

export function Layout(props: { children: JSX.Element; open: boolean; setOpen: (open: boolean) => void;}) {
  const { children, open, setOpen } = props
  const windowWidth = useWindowWidth()
  const isMobile = windowWidth < breakpoints.mobile

  return (
    <Typography component="div" variant={variants.bodyRegular}>
      <Main>{children}</Main>
      {isMobile && <DrawerNav open={open} setOpen={setOpen} />}
    </Typography>
  )
}

Layout.Nav = Nav
Layout.Page = Page
