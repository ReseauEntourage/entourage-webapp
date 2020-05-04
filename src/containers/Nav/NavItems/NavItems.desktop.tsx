import AddCircleIcon from '@material-ui/icons/AddCircle'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import MapIcon from '@material-ui/icons/Map'
import PersonIcon from '@material-ui/icons/Person'
import React, { useCallback } from 'react'
import { LoggedChunk } from '../LoggedChunk'
import { ConnectButton, NavItem, Grow, AccountContainer } from '../Nav.styles'
import { NavTakeAction } from '../NavTakeAction'
import { useOpenModalProfileOnLogin } from '../useOpenModalProfileOnLogin'
import { openModal } from 'src/components/Modal'
import { ModalSignIn } from 'src/containers/ModalSignIn'
import { useQueryMe } from 'src/core/store'
import { texts } from 'src/i18n'

export function NavItemsDeskTop() {
  const { data: me } = useQueryMe()

  useOpenModalProfileOnLogin()

  const onClickSignIn = useCallback(() => {
    openModal(<ModalSignIn />)
  }, [])

  const iAmLogged = me && !me.data.user.anonymous

  return (
    <>
      <a href="/">
        <img alt="Entourage" height="34" src="/logo-entourage-orange.png" />
      </a>
      <Grow />
      <NavItem
        href="/actions"
        icon={<MapIcon />}
        label={texts.nav.actions}
      />
      {iAmLogged && (
        <>
          <NavItem
            href="/messages"
            icon={<ChatBubbleOutlineIcon />}
            label={texts.nav.messages}
          />
          <NavTakeAction>
            <NavItem
              icon={<AddCircleIcon color="primary" style={{ fontSize: 30 }} />}
              label={texts.nav.takeAction}
            />
          </NavTakeAction>
        </>
      )}
      <AccountContainer>
        {iAmLogged ? (
          <LoggedChunk />
        ) : (
          <ConnectButton onClick={onClickSignIn}>
            <PersonIcon />
            {texts.nav.signIn}
          </ConnectButton>
        )}
      </AccountContainer>
    </>
  )
}
