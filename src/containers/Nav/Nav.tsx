import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import MapIcon from '@material-ui/icons/Map'
import MenuIcon from '@material-ui/icons/Menu'
import PersonIcon from '@material-ui/icons/Person'
import clsx from 'clsx'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Button } from 'src/components/Button'
import { openModal } from 'src/components/Modal'
import { ModalProfile } from 'src/containers/ModalProfile'
import { ModalSignIn } from 'src/containers/ModalSignIn'
import { useOnLogin } from 'src/core/events'
import { useQueryMe } from 'src/core/store'
import { texts } from 'src/i18n'
import { colors, theme } from 'src/styles'
import { plateform } from 'src/utils/misc'
import { LoggedChunk } from './LoggedChunk'
import { NavItem } from './NavItem'
import { NavTakeAction } from './NavTakeAction'

const AccountContainer = styled.div`
  margin-left: ${theme.spacing(10)}px;
`

const useStyles = makeStyles(() => createStyles({
  appBar: {
    backgroundColor: '#fff',
    borderBottom: `solid 1px ${colors.main.borderColorNav}`,
    color: colors.main.text,
  },
  grow: {
    flexGrow: 1,
  },
  buttonIcon: {
    marginRight: theme.spacing(1),
  },
  buttonMarginLeft: {
    marginLeft: theme.spacing(2),
  },
  navItem: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
}))

function NavItemsDeskTop() {
  const classes = useStyles()
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
          <Button className={classes.buttonMarginLeft} onClick={onClickSignIn}>
            <PersonIcon className={classes.buttonIcon} />
              Connexion / Inscription
          </Button>
        )}
      </AccountContainer>
    </>
  )
}

function NavItemsMobile(props: NavProps) {
  const { open, setOpen } = props
  const classes = useStyles()

  const handleDrawerOpen = useCallback(() => setOpen(true), [setOpen])

  return (
    <IconButton
      aria-label="open drawer"
      className={clsx(open && classes.hide)}
      color="inherit"
      edge="end"
      onClick={handleDrawerOpen}
    >
      <MenuIcon />
    </IconButton>
  )
}

interface NavProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Nav(props: NavProps) {
  const classes = useStyles()
  const { open, setOpen } = props

  const NavItems = plateform({
    Desktop: () => <NavItemsDeskTop />,
    Mobile: () => <NavItemsMobile open={open} setOpen={setOpen} />,
  })

  return (
    <div className={classes.grow}>
      <AppBar
        className={classes.appBar}
        position="static"
      >
        <Toolbar>
          <a href="/">
            <img alt="Entourage" height="34" src="/logo-entourage-orange.png" />
          </a>
          <div className={classes.grow} />
          <NavItems />
        </Toolbar>
      </AppBar>
    </div>
  )
}
