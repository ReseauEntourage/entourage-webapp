import TextFieldMUI, { TextFieldProps as TextFieldPropsBase } from '@material-ui/core/TextField'
import { useFormContext } from 'react-hook-form'
import { FieldError } from 'react-hook-form/dist/types'
import React from 'react'
import { helperTextError } from './helperTextErrors'

type Errors = Partial<Record<string, FieldError>>

export type TextFieldProps = {
  formErrors?: Errors;
  name?: string;
} & TextFieldPropsBase

export function TextField(props: TextFieldProps) {
  const {
    variant,
    error,
    helperText,
    formErrors: formErrorProps,
    name,
    ...restProps
  } = props

  const formContext = useFormContext()
  const formErrors = formErrorProps || (formContext && formContext.errors)
  const formError = (formErrors && name) ? formErrors[name] : null

  return (
    <TextFieldMUI
      error={!!formError}
      helperText={formError && helperTextError(formError)}
      margin="normal"
      name={name}
      variant="outlined"
      {...restProps}
    />
  )
}

