import React from 'react'
import {
  makeStyles, createStyles,
} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import PersonIcon from '@material-ui/icons/Person'
import Toolbar from '@material-ui/core/Toolbar'
import { ModalTrigger, openModal } from 'src/components/Modal'
import { Button } from 'src/components/Button'
import { colors } from 'src/styles'
import { useOnLogin } from 'src/events'
import { useQueryMe } from 'src/network/queries'
import { SignInModal } from './SignInModal'
import { ProfileModal } from './ProfileModal'
import { LoggedChunk } from './LoggedChunk'

const useStyles = makeStyles((theme) => createStyles({
  appBar: {
    backgroundColor: '#fff',
    borderBottom: `solid 1px ${colors.main.borderColorNav}`,
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
}))

export function Nav() {
  const classes = useStyles()
  const { data: me } = useQueryMe()

  useOnLogin((meResponse) => {
    const { firstName, lastName, address } = meResponse.data.user
    const userInfosIncompleted = !firstName || !lastName || address

    if (userInfosIncompleted) {
      openModal(<ProfileModal />)
    }
  })

  const iAmLogged = me && !me.data.user.anonymous

  return (
    <div className={classes.grow}>
      <AppBar
        position="static"
        className={classes.appBar}
      >
        <Toolbar>
          <a href="/">
            <img src="/logo-entourage-orange.png" alt="Entourage" height="34" />
          </a>
          <div className={classes.grow} />
          {iAmLogged ? (
            <LoggedChunk />
          ) : (
            <>
              <ModalTrigger
                modal={(<SignInModal />)}
              >
                <Button className={classes.buttonMarginLeft}>
                  <PersonIcon className={classes.buttonIcon} />
                  Connexion / Inscription
                </Button>
              </ModalTrigger>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  )
}
