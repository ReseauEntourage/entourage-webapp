import { InputAdornment, IconButton } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import React, { useRef, useEffect, useState } from 'react'
import { Step } from '../ModalSignIn'
import { TextField } from 'src/components/Form'
import { texts } from 'src/i18n'
import { useDefinePasswordStep } from './useDefinePasswordStep'

type DefinePasswordForm = ReturnType<
  typeof useDefinePasswordStep
>['definePasswordForm'];

interface DefinePasswordFieldProps {
  definePasswordForm: DefinePasswordForm;
  step: Step;
}

export function DefinePasswordField(props: DefinePasswordFieldProps) {
  const { definePasswordForm, step } = props
  const stepDone = useRef<boolean>()
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)

  useEffect(() => {
    if (step === 'define-password') {
      stepDone.current = true
    }
  }, [step])

  const showFields = step === 'define-password' || stepDone.current
  const stepPast = step !== 'define-password' && stepDone.current

  if (!showFields) {
    return null
  }

  return (
    <>
      <TextField
        autoFocus={true}
        disabled={stepPast}
        formErrors={definePasswordForm.errors}
        fullWidth={true}
        InputProps={{
          // <-- This is where the toggle button is added.
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        inputRef={definePasswordForm.register({
          required: true,
        })}
        label="Choisissez votre mot de passe"
        name="password"
        type="password"
      />
      <TextField
        disabled={stepPast}
        formErrors={definePasswordForm.errors}
        fullWidth={true}
        InputProps={{
          // <-- This is where the toggle button is added.
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        inputRef={definePasswordForm.register({
          required: true,
          validate: {
            confirmation: (confirmationPassword) => {
              return confirmationPassword !== definePasswordForm.getValues().password
                ? texts.form.INCORRECT_VALUE
                : true
            },
          },
        })}
        label="Confirmez votre mot de passe"
        name="confirmationPassword"
        type="password"
      />
    </>
  )
}
