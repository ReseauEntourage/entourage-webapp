import ButtonMUI, { ButtonProps as ButtonPropsBase } from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'
import { colors } from 'src/styles'

interface ButtonProps extends ButtonPropsBase {
  loaderStyle?: React.CSSProperties;
  loading?: boolean;
  // target is missing in Material ButtonPropsBase def, but it works
  target?: string;
}

export function Button(props: ButtonProps) {
  const { style, loading, startIcon, loaderStyle, ...restProps } = props

  const finalStartIcon = loading ? (
    <CircularProgress
      size={16}
      style={{
        ...loaderStyle,
        color: (restProps.variant === 'outlined' || restProps.color === 'secondary') ? undefined : colors.main.white,
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
        textTransform: 'uppercase',
        ...style,
      }}
    />
  )
}
