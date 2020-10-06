import React from 'react'
import { Step } from '../ModalSignIn'
import { TextField, validators } from 'src/components/Form'
import { usePhoneStep } from './usePhoneStep'

type PhoneForm = ReturnType<
  typeof usePhoneStep
>['phoneForm'];

interface PhoneFieldProps {
  phoneForm: PhoneForm;
  step: Step;
}

export function PhoneField(props: PhoneFieldProps) {
  const { phoneForm, step } = props

  return (
    <TextField
      autoFocus={true}
      disabled={step !== 'phone'}
      formErrors={phoneForm.errors}
      fullWidth={true}
      inputRef={phoneForm.register({
        required: true,
        validate: {
          phone: validators.phone,
        },
      })}
      label="Téléphone"
      name="phone"
      type="text"
    />
  )
}
