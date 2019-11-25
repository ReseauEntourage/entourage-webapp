import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import { theme } from 'src/styles/theme'
import { Button } from './Button'

const useStyles = makeStyles(() => createStyles({
  margin: {
    margin: theme.spacing(1),
  },
}))

export default {
  title: 'Buttons',
}

export const Buttons = () => {
  const classes = useStyles()

  return (
    <ThemeProvider theme={theme}>
      <div>
        <div>
          <Button className={classes.margin}>Participer</Button>
        </div>
        <div>
          <Button variant="outlined" className={classes.margin}>Participer</Button>
        </div>
      </div>
    </ThemeProvider>
  )
}
