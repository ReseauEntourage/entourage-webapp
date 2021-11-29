import { Badge } from '@material-ui/core'
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
import ExploreIcon from '@material-ui/icons/Explore'
import MapIcon from '@material-ui/icons/Map'
import PersonIcon from '@material-ui/icons/Person'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { NavItem } from '../NavItem'
import { NavTakeAction } from '../NavTakeAction'
import { useOnClickLogout } from '../useOnClickLogout'
import { useOpenModalsOnLogin } from '../useOpenModalsOnLogin'
import { Avatar } from 'src/components/Avatar'
import { openModal } from 'src/components/Modal'
import { useLayoutContext } from 'src/containers/LayoutContext'
import { ModalProfile } from 'src/containers/ModalProfile'
import { ModalSignIn } from 'src/containers/ModalSignIn'
import { selectNumberOfUnreadConversations } from 'src/core/useCases/messages'
import { useCurrentRoute } from 'src/hooks/useCurrentRoute'
import { useMe } from 'src/hooks/useMe'
import { texts } from 'src/i18n'
import { theme } from 'src/styles'
import * as S from './DrawerNav.styles'

export function DrawerNavMobile() {
  const me = useMe()
  const iAmLogged = !!me
  const { drawerIsOpen: open, setDrawerIsOpen: setOpen } = useLayoutContext()
  const { currentRoute } = useCurrentRoute()
  const numberOfUnreadConversations = useSelector(selectNumberOfUnreadConversations)

  useOpenModalsOnLogin()

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

  return (
    <Drawer
      anchor="left"
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      open={open}
      variant="persistent"
    >
      <S.DrawerHeader>
        <IconButton onClick={onClickDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </S.DrawerHeader>
      <Divider />
      <List>
        <ListItem key="actions" button={true}>
          <NavItem
            href="/actions"
            icon={<MapIcon />}
            isActive={currentRoute === '/actions'}
            label={texts.nav.actions}
            onClick={onClickDrawerClose}
          />
        </ListItem>
        <ListItem key="pois" button={true}>
          <NavItem
            href="/pois"
            icon={<ExploreIcon />}
            isActive={currentRoute === '/pois'}
            label={texts.nav.pois}
            onClick={onClickDrawerClose}
          />
        </ListItem>
        {iAmLogged && (
          <>
            <ListItem key="messages" button={true}>
              <NavItem
                href="/messages"
                icon={(
                  <Badge
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    badgeContent={numberOfUnreadConversations}
                    color="error"
                  >
                    <ChatBubbleOutlineIcon />
                  </Badge>
                )}
                isActive={currentRoute === '/messages'}
                label={texts.nav.messages}
                onClick={onClickDrawerClose}
              />
            </ListItem>
            <ListItem key="take_action" button={true}>
              <NavTakeAction hideEventCreation={!me?.partner}>
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
        {
          (iAmLogged && !!me) && (
            <ListItem key="profil" button={true} onClick={openModalProfile}>
              <NavItem
                icon={<Avatar src={me.avatarUrl} style={{ width: 24, height: 24 }} />}
                label={texts.nav.profile}
                onClick={onClickDrawerClose}
              />
            </ListItem>
          )
        }
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
