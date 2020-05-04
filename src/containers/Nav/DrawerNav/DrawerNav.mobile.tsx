import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import MapIcon from '@material-ui/icons/Map'
import PersonIcon from '@material-ui/icons/Person'
import React, { useCallback } from 'react'
import { DrawerHeader } from '../Nav.styles'
import { NavItem } from '../NavItem'
import { NavTakeAction } from '../NavTakeAction'
import { useOnClickLogout } from '../useOnClickLogout'
import { useOpenModalProfileOnLogin } from '../useOpenModalProfileOnLogin'
import { openModal } from 'src/components/Modal'
import { useLayoutContext } from 'src/containers/LayoutContext'
import { ModalProfile } from 'src/containers/ModalProfile'
import { ModalSignIn } from 'src/containers/ModalSignIn'
import { useQueryMe } from 'src/core/store'
import { texts } from 'src/i18n'
import { theme } from 'src/styles'

export function DrawerNavMobile() {
  const { data: me } = useQueryMe()
  const { drawerIsOpen: open, setDrawerIsOpen: setOpen } = useLayoutContext()

  useOpenModalProfileOnLogin()

  const onClickDrawerClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const onClickSignIn = useCallback(() => {
    openModal(<ModalSignIn />)
  }, [])

  const openModalProfile = useCallback(() => {
    openModal(<ModalProfile />)
  }, [])

  const onClickLogout = useOnClickLogout()

  const iAmLogged = me && !me.data.user.anonymous

  return (
    <Drawer
      anchor="left"
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      open={open}
      variant="persistent"
    >
      <DrawerHeader>
        <IconButton onClick={onClickDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <ListItem key="actions" button={true}>
          <NavItem
            href="/actions"
            icon={<MapIcon />}
            label={texts.nav.actions}
            onClick={onClickDrawerClose}
          />
        </ListItem>
        {iAmLogged && (
          <>
            <ListItem key="messages" button={true}>

              <NavItem
                href="/messages"
                icon={<ChatBubbleOutlineIcon />}
                label={texts.nav.messages}
                onClick={onClickDrawerClose}
              />
            </ListItem>
            <ListItem key="take_action" button={true}>
              <NavTakeAction>
                <NavItem
                  icon={<AddCircleIcon color="primary" />}
                  label={texts.nav.takeAction}
                />
              </NavTakeAction>
            </ListItem>
          </>
        )}
      </List>
      <Divider />
      <List>
        {iAmLogged && (
          <ListItem key="profil" button={true} onClick={openModalProfile}>
            <NavItem
              icon={<PersonIcon />}
              label={texts.nav.profile}
              onClick={onClickDrawerClose}
            />
          </ListItem>

        )}
        <ListItem key="connect" button={true} onClick={iAmLogged ? onClickLogout : onClickSignIn}>
          <NavItem
            icon={iAmLogged ? <ExitToAppIcon /> : <PersonIcon />}
            label={iAmLogged ? texts.nav.logout : texts.nav.signIn}
            onClick={onClickDrawerClose}
          />
        </ListItem>
      </List>
    </Drawer>
  )
}
