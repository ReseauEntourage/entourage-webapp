import React, { useState } from 'react'
import { ToggleVisibility } from 'src/components/ToggleVisibility'
import { TextField, TextFieldProps } from './TextField'

type TextFieldPasswordProps = TextFieldProps

export function TextFieldPassword(props: TextFieldPasswordProps) {
  const { disabled, ...restProps } = props

  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)

  return (
    <TextField
      disabled={disabled}
      InputProps={{
        endAdornment: <ToggleVisibility
          disabled={disabled}
          handleClickShowPassword={handleClickShowPassword}
          showPassword={showPassword}
        />,
      }}
      type={showPassword ? 'text' : 'password'}
      {...restProps}
    />
  )
}
