import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useForm } from 'react-hook-form'
import React, { useCallback } from 'react'
import { useI18n } from '../../i18n'
import { Button } from 'src/components/Button'
import { TextField, validators } from 'src/components/Form'
import { ThemeProvider, theme } from 'src/styles'
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
  const { register, getValues, trigger, errors } = useForm()

  const onValidate = useCallback(async () => {
    await trigger()
    // eslint-disable-next-line
    console.log('value', getValues())
  }, [getValues, trigger])

  const texts = useI18n()

  return (
    <Modal onValidate={onValidate} title="Form Demo">
      <TextField
        autoFocus={true}
        formErrors={errors}
        fullWidth={true}
        inputRef={register({ required: true })}
        label="Prénom"
        name="firstname"
      />
      <TextField
        formErrors={errors}
        fullWidth={true}
        inputRef={
          register({
            required: true,
            validate: {
              email: (email) => {
                return validators.email(email, texts)
              },
            },
          })
        }
        label="Nom"
        name="lastname"
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
          <Button className={classes.margin} onClick={onClickForm} variant="outlined">Form</Button>
        </div>
      </div>
    </ThemeProvider>
  )
}
