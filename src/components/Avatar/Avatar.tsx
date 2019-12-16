import AvatarMUI from '@material-ui/core/Avatar'
import React from 'react'
import styled from 'styled-components'
import { colors } from 'src/styles'

export const NoProfilePicture = styled.div`
  height: 36px;
  width: 36px;
  border-radius: 100%;
  background-color: ${colors.main.primary};
`

const Container = styled.div`
  border-radius: 100%;
`

interface AvatarProps {
  alt?: string;
  borderColor?: keyof typeof colors.main;
  src?: string | null;
  style?: React.CSSProperties;
}

export function Avatar(props: AvatarProps) {
  const { src, alt = 'Alt text', borderColor, style } = props

  const content = src
    ? <AvatarMUI alt={alt} src={src} style={{ width: 36, height: 36, maxWidth: '100%', maxHeight: '100%' }} />
    : <NoProfilePicture />

  return (
    <Container
      style={{
        ...style,
        border: !borderColor ? undefined : `solid 1px ${borderColor}`,
      }}
    >
      {content}
    </Container>
  )
}
