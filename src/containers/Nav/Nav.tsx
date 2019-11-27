import React from 'react'
import {
  makeStyles, createStyles,
} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import PersonIcon from '@material-ui/icons/Person'
import Toolbar from '@material-ui/core/Toolbar'
import { ModalTrigger } from 'src/components/Modal'
import { Button } from 'src/components/Button'
import { colors } from 'src/styles'
import { useMainContext } from 'src/containers/MainContext'
import { SignInModal } from './SignInModal'

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
  const mainContext = useMainContext()

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
          {mainContext.me ? (
            <Avatar alt="John Doe" src="https://i.pravatar.cc/100" />
          ) : (
            <>
              {/* <Button>
                <PersonIcon className={classes.buttonIcon} />
                Connexion
              </Button> */}
              <ModalTrigger
                modal={(<SignInModal />)}
              >
                <Button className={classes.buttonMarginLeft}>
                  <PersonIcon className={classes.buttonIcon} />
                  {/* Rejoignez le réseau ! */}
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
