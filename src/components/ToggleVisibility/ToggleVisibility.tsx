import { IconButton, InputAdornment } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import React from 'react'

export interface ToggleVisibilityProps {
  disabled?: boolean;
  handleClickShowPassword: () => void;
  showPassword: boolean;
}

export function ToggleVisibility(props: ToggleVisibilityProps) {
  const { disabled = false, handleClickShowPassword, showPassword } = props
  return (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        disabled={disabled}
        onClick={handleClickShowPassword}
      >
        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </IconButton>
    </InputAdornment>
  )
}
