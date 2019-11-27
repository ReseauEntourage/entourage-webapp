import React from 'react'
import TextFieldMUI, { TextFieldProps } from '@material-ui/core/TextField'
import { helperTextError } from './helperTextErrors'

type Props = {
  formError?: Parameters<typeof helperTextError>[0];
} & TextFieldProps

export function TextField(props: Props) {
  const {
    variant,
    margin,
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

