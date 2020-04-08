import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import MapIcon from '@material-ui/icons/Map'
import PersonIcon from '@material-ui/icons/Person'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Button } from 'src/components/Button'
import { openModal } from 'src/components/Modal'
import { ModalProfile } from 'src/containers/ModalProfile'
import { ModalSignIn } from 'src/containers/ModalSignIn'
import { useOnLogin } from 'src/core/events'
import { useQueryMe } from 'src/core/store'
import { texts } from 'src/i18n'
import { theme } from 'src/styles'
import { LoggedChunk } from './LoggedChunk'
import { NavItem } from './NavItem'
import { NavTakeAction } from './NavTakeAction'

const AccountContainer = styled.div`
  margin-left: ${theme.spacing(10)}px;
`
const drawerWidth = 240

const useStyles = makeStyles(() => createStyles({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  drawerFooter: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 3),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  buttonIcon: {
    marginRight: theme.spacing(1),
  },
  buttonMarginLeft: {
    marginLeft: theme.spacing(2),
  },
}))

interface DrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function DrawerNav(props: DrawerProps) {
  const classes = useStyles()
  const { data: me } = useQueryMe()
  const { open, setOpen } = props

  useOnLogin((meResponse) => {
    const { firstName, lastName, address, hasPassword } = meResponse.data.user
    const userInfosIncompleted = !firstName || !lastName || !address

    if (hasPassword && userInfosIncompleted) {
      openModal(<ModalProfile />)
    }
  })

  const onClickDrawerClose = useCallback(() => {
    setOpen(!open)
  }, [open, setOpen])

  const onClickSignIn = useCallback(() => {
    openModal(<ModalSignIn />)
  }, [])

  const iAmLogged = me && !me.data.user.anonymous

  return (
    <Drawer
      anchor="right"
      classes={{
        paper: classes.drawerPaper,
      }}
      className={classes.drawer}
      open={open}
      variant="persistent"
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={onClickDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <Divider />
      <AccountContainer>
        {iAmLogged ? (
          <LoggedChunk />
        ) : (
          <Button className={classes.buttonMarginLeft} onClick={onClickSignIn}>
            <PersonIcon className={classes.buttonIcon} />
                 Connexion / Inscription
          </Button>
        )}
      </AccountContainer>
      <Divider />
      <List>
        <ListItem key="actions" button={true}>
          <NavItem
            href="/actions"
            icon={<MapIcon />}
            label={texts.nav.actions}
          />
        </ListItem>
        {iAmLogged && (
          <>
            <ListItem key="actions" button={true}>

              <NavItem
                href="/messages"
                icon={<ChatBubbleOutlineIcon />}
                label={texts.nav.messages}
              />
            </ListItem>

            <ListItem key="actions" button={true}>

              <NavTakeAction>
                <NavItem
                  icon={<AddCircleIcon color="primary" style={{ fontSize: 30 }} />}
                  label={texts.nav.takeAction}
                />
              </NavTakeAction>
            </ListItem>

          </>
        )}
      </List>
    </Drawer>
  )
}
