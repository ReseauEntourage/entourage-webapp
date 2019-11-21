import React from 'react'
import {
  makeStyles, createStyles,
} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Toolbar from '@material-ui/core/Toolbar'

const useStyles = makeStyles(() => createStyles({
  grow: {
    flexGrow: 1,
  },
}))

export function Nav() {
  const classes = useStyles()

  return (
    <div className={classes.grow}>
      <AppBar position="static" style={{ backgroundColor: '#fff' }}>
        <Toolbar>
          <a href="/">
            <img src="/logo-entourage-orange.png" alt="Entourage" height="34" />
          </a>
          <div className={classes.grow} />
          <Avatar alt="John Doe" src="https://i.pravatar.cc/100" />
        </Toolbar>
      </AppBar>
    </div>
  )
}
