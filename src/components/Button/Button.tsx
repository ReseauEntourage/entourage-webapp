import ButtonMUI, { ButtonProps } from '@material-ui/core/Button'
import React from 'react'

export function Button(props: ButtonProps = {}) {
  const { style, ...restProps } = props
  return (
    <ButtonMUI
      color="primary"
      size="medium"
      variant="contained"
      {...restProps}
      style={{
        borderRadius: 20,
        textTransform: 'none',
        ...style,
      }}
    />
  )
}
