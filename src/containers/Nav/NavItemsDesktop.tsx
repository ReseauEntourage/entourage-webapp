import AddCircleIcon from '@material-ui/icons/AddCircle'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import MapIcon from '@material-ui/icons/Map'
import PersonIcon from '@material-ui/icons/Person'
import React, { useCallback } from 'react'
import { openModal } from 'src/components/Modal'
import { ModalProfile } from 'src/containers/ModalProfile'
import { ModalSignIn } from 'src/containers/ModalSignIn'
import { useOnLogin } from 'src/core/events'
import { useQueryMe } from 'src/core/store'
import { texts } from 'src/i18n'
import { LoggedChunk } from './LoggedChunk'
import { ConnectButton, NavItem, Grow, AccountContainer } from './Nav.styles'
import { NavTakeAction } from './NavTakeAction'

export function NavItemsDeskTop() {
  const { data: me } = useQueryMe()

  useOnLogin((meResponse) => {
    const { firstName, lastName, address, hasPassword } = meResponse.data.user
    const userInfosIncompleted = !firstName || !lastName || !address

    if (hasPassword && userInfosIncompleted) {
      openModal(<ModalProfile />)
    }
  })

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
      { iAmLogged && (
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
      ) }
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
