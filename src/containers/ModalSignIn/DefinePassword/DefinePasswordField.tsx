import useForm from 'react-hook-form'
import React, { useRef, useEffect } from 'react'
import { Step } from '../ModalSignIn'
import { TextField } from 'src/components/Form'
import { texts } from 'src/i18n'

type DefinePasswordForm = ReturnType<typeof useForm>

interface DefinePasswordFieldProps {
  definePasswordForm: DefinePasswordForm;
  step: Step;
}

export function DefinePasswordField(props: DefinePasswordFieldProps) {
  const { definePasswordForm, step } = props
  const stepDone = useRef<boolean>()

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
