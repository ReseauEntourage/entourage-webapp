import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import ExploreIcon from '@material-ui/icons/Explore'
import MapIcon from '@material-ui/icons/Map'
import PersonIcon from '@material-ui/icons/Person'
import React, { useCallback } from 'react'
import { LoggedChunk } from '../LoggedChunk'
import * as S from '../Nav.styles'
import { NavTakeAction } from '../NavTakeAction'
import { useOpenModalsOnLogin } from '../useOpenModalsOnLogin'
import { openModal } from 'src/components/Modal'
import { ModalSignIn } from 'src/containers/ModalSignIn'
import { useCurrentRoute } from 'src/hooks/useCurrentRoute'
import { useMe } from 'src/hooks/useMe'
import { texts } from 'src/i18n'
import { variants } from 'src/styles'

export function NavItemsDeskTop() {
  const iAmLogged = !!useMe()
  const { routeTitle, currentRoute } = useCurrentRoute()

  useOpenModalsOnLogin()

  const onClickSignIn = useCallback(() => {
    openModal(<ModalSignIn />)
  }, [])

  return (
    <>
      <S.TitleContainer>
        <a href="/">
          <img alt="Entourage" height="34" src="/logo-entourage-orange.png" />
        </a>
        <Box marginLeft={3}>
          <Typography variant={variants.title1}>
            {routeTitle}
          </Typography>
        </Box>
      </S.TitleContainer>

      <S.Grow />
      <S.NavItem
        href="/actions"
        icon={<MapIcon />}
        isActive={currentRoute === '/actions'}
        label={texts.nav.actions}
      />
      <S.NavItem
        href="/pois"
        icon={<ExploreIcon />}
        isActive={currentRoute === '/pois'}
        label={texts.nav.pois}
      />
      {iAmLogged && (
        <>
          <S.NavItem
            href="/messages"
            icon={<ChatBubbleOutlineIcon />}
            isActive={currentRoute === '/messages'}
            label={texts.nav.messages}
          />
          <NavTakeAction>
            <S.NavItem
              icon={<AddCircleIcon color="primary" style={{ fontSize: 30 }} />}
              label={texts.nav.takeAction}
            />
          </NavTakeAction>
        </>
      )}
      <S.AccountContainer>
        {iAmLogged ? (
          <LoggedChunk />
        ) : (
          <S.ConnectButton onClick={onClickSignIn}>
            <PersonIcon />
            {texts.nav.signIn}
          </S.ConnectButton>
        )}
      </S.AccountContainer>
    </>
  )
}
