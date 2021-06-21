import Toolbar from '@material-ui/core/Toolbar'
import React from 'react'
import * as S from './Nav.styles'
import { NavItems } from './NavItems'

export function Nav() {
  return (
    <S.Grow>
      <S.AppBar
        position="static"
      >
        <Toolbar>
          <NavItems />
        </Toolbar>
      </S.AppBar>
    </S.Grow>
  )
}
