import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { theme } from 'src/styles'
import { Button } from './Button'

const useStyles = makeStyles(() => createStyles({
  btns: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}))

export default {
  title: 'Buttons',
}

export const Buttons = () => {
  const classes = useStyles()

  return (
    <TransparentWrapper transparentGB={true}>
      <div className={classes.btns}>
        <Button>Participer</Button>
        <Button variant="outlined">Participer</Button>
        <Button color="secondary">Participer</Button>
        <Button loading={true}>Loading</Button>
        <Button
          loading={true}
          variant="outlined"
        >
          Loading
        </Button>
      </div>
    </TransparentWrapper>
  )
}
