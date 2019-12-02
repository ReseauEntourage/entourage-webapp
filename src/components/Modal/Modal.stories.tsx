import React, { useCallback } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import useForm from 'react-hook-form'
import { Button } from 'src/components/Button'
import { ThemeProvider, theme } from 'src/styles'
import { TextField, validators } from 'src/components/Form'
import { Modal } from './Modal'
import { openModal, ModalsListener } from './openModal'

const useStyles = makeStyles(() => createStyles({
  margin: {
    margin: theme.spacing(1),
  },
}))

export default {
  title: 'Modals',
}

function BasicModal() {
  return (
    <Modal title="Test">
      Hello
    </Modal>
  )
}

function FormModal() {
  const { register, getValues, triggerValidation, errors } = useForm()

  const onValidate = useCallback(async () => {
    await triggerValidation()
    // eslint-disable-next-line
    console.log('value', getValues())
  }, [getValues, triggerValidation])

  return (
    <Modal title="Form Demo" onValidate={onValidate}>
      <TextField
        autoFocus={true}
        label="Prénom"
        name="firstname"
        fullWidth={true}
        inputRef={register({ required: true })}
        formError={errors.firstname}
      />
      <TextField
        label="Nom"
        name="lastname"
        fullWidth={true}
        inputRef={
          register({
            required: true,
            validate: {
              email: validators.email,
            },
          })
        }
        formError={errors.lastname}
      />
    </Modal>
  )
}

export const Modals = () => {
  const classes = useStyles()

  const onClickBasic = useCallback(() => {
    openModal(<BasicModal />)
  }, [])

  const onClickForm = useCallback(() => {
    openModal(<FormModal />)
  }, [])

  return (
    <ThemeProvider>
      <ModalsListener />
      <div>
        <div>
          <Button className={classes.margin} onClick={onClickBasic}>Basic</Button>
        </div>
        <div>
          <Button variant="outlined" className={classes.margin} onClick={onClickForm}>Form</Button>
        </div>
      </div>
    </ThemeProvider>
  )
}
