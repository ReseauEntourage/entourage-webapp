import TextFieldMUI, { TextFieldProps as TextFieldPropsBase } from '@material-ui/core/TextField'
import { useFormContext } from 'react-hook-form'
import { FieldError } from 'react-hook-form/dist/types'
import React from 'react'
import { helperTextError } from './helperTextErrors'

type Errors = Partial<Record<string, FieldError>>

export type TextFieldProps = {
  formErrors?: Errors;
  name?: string;
  errorText?: string;
} & TextFieldPropsBase

export function TextField(props: TextFieldProps) {
  const {
    variant,
    // error,
    errorText,
    helperText: helperTextProps,
    formErrors: formErrorProps,
    name,
    ...restProps
  } = props

  const formContext = useFormContext()
  const formErrors = formErrorProps || (formContext && formContext.errors)
  const formError = (formErrors && name) ? formErrors[name] : null

  const hasError = !!formError || !!errorText
  const helperText = formError
    ? helperTextError(formError)
    : errorText

  return (
    <TextFieldMUI
      error={hasError}
      helperText={helperText}
      margin="normal"
      name={name}
      variant="outlined"
      {...restProps}
    />
  )
}

