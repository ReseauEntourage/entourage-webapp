import React from 'react'
import ButtonMUI, { ButtonProps } from '@material-ui/core/Button'

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
