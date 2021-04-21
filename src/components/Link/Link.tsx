import { LinkProps } from '@material-ui/core/Link'
import React from 'react'
import { variants } from 'src/styles'
import * as S from './Link.styles'

export const Link = React.forwardRef((props: LinkProps & { disableHover?: boolean; }, ref) => {
  const { children, variant, color, disableHover = false, ...restProps } = props
  const componentProp = restProps.onClick ? { component: 'button' } : {}

  return disableHover ? (
    <S.StyledLink
      ref={ref}
      color={color ?? 'inherit'}
      variant={variant ?? variants.bodyRegular}
      {...restProps}
      {...componentProp}
    >
      {children}
    </S.StyledLink>
  )
    : (
      <S.HoverableStyledLink
        ref={ref}
        color={color ?? 'inherit'}
        variant={variant ?? variants.bodyRegular}
        {...restProps}
        {...componentProp}
      >
        {children}
      </S.HoverableStyledLink>
    )
})
