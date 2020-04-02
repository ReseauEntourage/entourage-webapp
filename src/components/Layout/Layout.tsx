import { Typography } from '@material-ui/core'
import React from 'react'
import { variants } from 'src/styles'
import { Main, Page, Nav } from './Layout.styles'

export function Layout(props: {children: JSX.Element;}) {
  const { children } = props
  return (
    <Typography component="div" variant={variants.bodyRegular}>
      <Main>
        {children}
      </Main>
    </Typography>
  )
}

Layout.Nav = Nav
Layout.Page = Page
