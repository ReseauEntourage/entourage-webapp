import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import React, { useCallback } from 'react'
import * as S from '../Nav.styles'
import { useLayoutContext } from 'src/containers/LayoutContext'

export function NavItemsMobile() {
  const { setDrawerIsOpen: setOpen } = useLayoutContext()

  const handleDrawerOpen = useCallback(() => setOpen(true), [setOpen])

  return (
    <>
      <IconButton
        aria-label="open drawer"
        color="inherit"
        edge="end"
        name="OpenDrawerButton"
        onClick={handleDrawerOpen}
      >
        <MenuIcon />
      </IconButton>
      <S.Grow />
      <a href="/">
        <img alt="Entourage" height="34" src="/logo-entourage-orange.png" />
      </a>
      <S.Grow />
      <div style={{ width: '48px' }} />
    </>
  )
}
