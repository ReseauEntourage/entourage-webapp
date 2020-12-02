import AddCircleIcon from '@material-ui/icons/AddCircle'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import MapIcon from '@material-ui/icons/Map'
import PersonIcon from '@material-ui/icons/Person'
import React, { useCallback } from 'react'
import { LoggedChunk } from '../LoggedChunk'
import * as S from '../Nav.styles'
import { NavTakeAction } from '../NavTakeAction'
import { useOpenModalProfileOnLogin } from '../useOpenModalProfileOnLogin'
import { openModal } from 'src/components/Modal'
import { ModalSignIn } from 'src/containers/ModalSignIn'
import { useMe } from 'src/hooks/useMe'
import { texts } from 'src/i18n'

export function NavItemsDeskTop() {
  const iAmLogged = !!useMe()

  useOpenModalProfileOnLogin()

  const onClickSignIn = useCallback(() => {
    openModal(<ModalSignIn />)
  }, [])

  return (
    <>
      <a href="/">
        <img alt="Entourage" height="34" src="/logo-entourage-orange.png" />
      </a>
      <S.Grow />
      <S.NavItem
        href="/actions"
        icon={<MapIcon />}
        label={texts.nav.actions}
      />
      {iAmLogged && (
        <>
          <S.NavItem
            href="/messages"
            icon={<ChatBubbleOutlineIcon />}
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
