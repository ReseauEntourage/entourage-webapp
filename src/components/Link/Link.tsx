import { LinkProps } from '@material-ui/core/Link'
import React, { RefObject } from 'react'
import { variants } from 'src/styles'
import * as S from './Link.styles'

export const Link = React.forwardRef(
  (props:
  LinkProps & {
    component?: React.ElementType<React.HTMLAttributes<HTMLElement>>;
    disableHover?: boolean;
  }, ref) => {
    const { children, variant, color, disableHover = false, ...restProps } = props
    const componentProp = restProps.onClick && !restProps.href ? { component: 'button' } : {}

    return disableHover ? (
      <S.StyledLink
        ref={ref as RefObject<HTMLSpanElement>}
        color={color || 'inherit'}
        variant={variant || variants.bodyRegular}
        {...componentProp}
        {...restProps}
      >
        {children}
      </S.StyledLink>
    )
      : (
        <S.HoverableStyledLink
          ref={ref as RefObject<HTMLSpanElement>}
          color={color || 'inherit'}
          variant={variant || variants.bodyRegular}
          {...componentProp}
          {...restProps}
        >
          {children}
        </S.HoverableStyledLink>
      )
  },
)
