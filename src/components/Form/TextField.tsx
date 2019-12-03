import React from 'react'
import TextFieldMUI, { TextFieldProps as TextFieldPropsBase } from '@material-ui/core/TextField'
import { helperTextError } from './helperTextErrors'

export type TextFieldProps = {
  formError?: Parameters<typeof helperTextError>[0];
} & TextFieldPropsBase

export function TextField(props: TextFieldProps) {
  const {
    variant,
    error,
    helperText,
    formError,
    ...restProps
  } = props

  return (
    <TextFieldMUI
      variant="outlined"
      margin="normal"
      error={!!formError}
      helperText={helperTextError(formError)}
      {...restProps}
    />
  )
}

