import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { LinkProps } from '@material-ui/core/Link'
import React from 'react'
import { variants } from 'src/styles'
import * as S from './ContactLink.styles'

const stopPropagation = (event: React.SyntheticEvent) => event.stopPropagation()

interface ContactLinkProps {
  icon?: JSX.Element;
  highlighted?: boolean;
  disabled?: boolean;
  link: string;
  info: string;
  color?: LinkProps['color'];
}

export function ContactLink(props: ContactLinkProps) {
  const { link, info, icon, color, disabled } = props

  const iconComponent = (
    <Box
      alignItems="center"
      display="flex"
      justifyContent="center"
      marginRight={1}
    >
      {icon}
    </Box>
  )

  if (disabled) {
    return (
      <Box marginTop={1}>
        <S.StyledDisabledLink>
          {icon && iconComponent}
          <Typography
            color={color ?? 'textPrimary'}
            variant={variants.bodyRegular}
          >
            {info}
          </Typography>
        </S.StyledDisabledLink>
      </Box>
    )
  }

  return (
    <Box marginTop={1}>
      <S.StyledLink
        color={color ?? 'textPrimary'}
        href={link}
        onClick={stopPropagation}
        rel="noopener noreferrer"
        target="_blank"
        variant={variants.bodyRegular}
      >
        {icon && iconComponent}
        {info}
      </S.StyledLink>
    </Box>
  )
}
