import ButtonMUI, { ButtonProps as ButtonPropsBase } from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'

interface ButtonProps extends ButtonPropsBase {
  loaderStyle?: React.CSSProperties;
  loading?: boolean;
}

export function Button(props: ButtonProps = {}) {
  const { style, loading, startIcon, loaderStyle, ...restProps } = props

  const finalStartIcon = loading ? (
    <CircularProgress
      size={16}
      style={{
        ...loaderStyle,
        color: (restProps.variant === 'outlined' || restProps.color === 'secondary') ? undefined : '#fff',
      }}
    />
  ) : startIcon

  return (
    <ButtonMUI
      color="primary"
      size="medium"
      startIcon={finalStartIcon}
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
