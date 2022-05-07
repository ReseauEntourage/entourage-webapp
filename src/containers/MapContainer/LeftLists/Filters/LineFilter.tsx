import { SvgIconProps } from '@material-ui/core/SvgIcon'
import Switch from '@material-ui/core/Switch'
import { TypographyProps } from '@material-ui/core/Typography'
import React from 'react'
import { colors, variants } from 'src/styles'
import * as S from './Filters.styles'

export interface LineFilterProps {
  index?: number;
  label: string;
  Icon?: (props: SvgIconProps) => JSX.Element;
  onChange: () => void;
  variant?: TypographyProps['variant'];
  iconColor?: string;
  checked: boolean;
}

export function LineFilter(props: LineFilterProps) {
  const { index = 0, Icon, iconColor, onChange, checked, variant = variants.bodyRegular, label } = props

  return (
    <>
      {
        Icon && <S.Icon color={iconColor || colors.main.primary} index={index}><Icon /></S.Icon>
      }
      <S.Label index={index} variant={variant}>{label}</S.Label>
      <S.Switch index={index}><Switch checked={checked} color="primary" onChange={onChange} /></S.Switch>
    </>
  )
}
