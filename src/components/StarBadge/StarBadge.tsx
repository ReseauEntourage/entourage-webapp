import Star from '@material-ui/icons/Star'
import React from 'react'
import { colors } from 'src/styles'
import * as S from './StarBadge.styles'

interface StarBadgeProps {
  containerStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
}

export function StarBadge(props: StarBadgeProps) {
  const { containerStyle, iconStyle } = props
  return (
    <S.Container style={containerStyle}>
      <Star
        style={{
          fontSize: 10,
          display: 'block', // use to remove SVG margins
          color: colors.main.white,
          ...iconStyle,
        }}
      />
    </S.Container>
  )
}
