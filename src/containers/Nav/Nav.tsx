import Toolbar from '@material-ui/core/Toolbar'
import React from 'react'
import { useIsDesktop } from 'src/styles'
import * as S from './Nav.styles'
import { NavItems } from './NavItems'
import { NotificationBar } from './NavNotificationBar'

export function Nav() {
  const isDesktop = useIsDesktop()

  return (
    <S.Grow>
      <S.AppBar
        position="static"
      >
        {
          isDesktop && <NotificationBar />
        }
        <Toolbar>
          <NavItems />
        </Toolbar>
      </S.AppBar>
    </S.Grow>
  )
}
