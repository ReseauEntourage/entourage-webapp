import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { theme } from 'src/styles'
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
    <TransparentWrapper>
      <div>
        <div>
          <Button className={classes.margin}>Participer</Button>
        </div>
        <div>
          <Button className={classes.margin} variant="outlined">Participer</Button>
        </div>
        <div>
          <Button className={classes.margin} loading={true}>Loading</Button>
        </div>
        <div>
          <Button className={classes.margin} loading={true} variant="outlined">Loading</Button>
        </div>
      </div>
    </TransparentWrapper>
  )
}
