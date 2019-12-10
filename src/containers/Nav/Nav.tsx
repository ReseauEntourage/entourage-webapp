import React, { useCallback } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import PersonIcon from '@material-ui/icons/Person'
import Toolbar from '@material-ui/core/Toolbar'
import { openModal } from 'src/components/Modal'
import { Button } from 'src/components/Button'
import { colors } from 'src/styles'
import { useOnLogin } from 'src/events'
import { useQueryMe } from 'src/network/queries'
import { ModalSignIn } from 'src/containers/ModalSignIn'
import { ModalProfile } from 'src/containers/ModalProfile'
import { LoggedChunk } from './LoggedChunk'
import { NavTakeAction } from './NavTakeAction'

const useStyles = makeStyles((theme) => createStyles({
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
}))

export function Nav() {
  const classes = useStyles()
  const { data: me } = useQueryMe()

  useOnLogin((meResponse) => {
    const { firstName, lastName, address } = meResponse.data.user
    const userInfosIncompleted = !firstName || !lastName || !address

    if (userInfosIncompleted) {
      openModal(<ModalProfile />)
    }
  })

  const onClickSignIn = useCallback(() => {
    openModal(<ModalSignIn />)
  }, [])

  const iAmLogged = me && !me.data.user.anonymous

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
          {/* <Link href="/actions">
            <a>
              {texts.nav.actions}
            </a>
          </Link>
          <Link href="/messages">
            <a>
              {texts.nav.messages}
            </a>
          </Link> */}
          <div className={classes.navItem}>
            <NavTakeAction />
          </div>
          {iAmLogged ? (
            <LoggedChunk />
          ) : (
            <Button className={classes.buttonMarginLeft} onClick={onClickSignIn}>
              <PersonIcon className={classes.buttonIcon} />
              Connexion / Inscription
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  )
}
