import Toolbar from '@material-ui/core/Toolbar'
import React from 'react'
import { AppBar, Grow } from './Nav.styles'
import { NavItems } from './NavItems'

export function Nav() {
  return (
    <Grow>
      <AppBar
        position="static"
      >
        <Toolbar>
          <NavItems />
        </Toolbar>
      </AppBar>
    </Grow>
  )
}
