import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { ThemeProvider, theme } from 'src/styles'
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
    <ThemeProvider>
      <div>
        <div>
          <Button className={classes.margin}>Participer</Button>
        </div>
        <div>
          <Button className={classes.margin} variant="outlined">Participer</Button>
        </div>
      </div>
    </ThemeProvider>
  )
}
