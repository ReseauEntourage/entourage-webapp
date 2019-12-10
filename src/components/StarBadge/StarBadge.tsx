import Star from '@material-ui/icons/Star'
import React from 'react'
import styled from 'styled-components'
import { colors } from 'src/styles'

const Container = styled.div`
  border-radius: 100%;
  height: fit-content;
  width: fit-content;
  background-color: ${colors.main.primary};
  padding: 2px;
  border: solid 1px #ffff;
`

interface Props {
  containerStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
}

export function StarBadge(props: Props) {
  const { containerStyle, iconStyle } = props
  return (
    <Container style={containerStyle}>
      <Star
        style={{
          fontSize: 10,
          display: 'block', // use to remove SVG margins
          color: '#fff',
          ...iconStyle,
        }}
      />
    </Container>
  )
}
