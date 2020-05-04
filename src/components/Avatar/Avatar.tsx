import React from 'react'
import { colors } from 'src/styles'
import { Container, AvatarPicture, NoProfilePicture } from './Avatar.styles'

interface AvatarProps {
  alt?: string;
  borderColor?: keyof typeof colors.main;
  className?: string;
  src?: string | null;
  style?: React.CSSProperties;
}

export function Avatar(props: AvatarProps) {
  const { src, alt = 'Alt text', borderColor, style, className } = props

  return (
    <Container
      className={className}
      style={{
        ...style,
        border: !borderColor ? undefined : `solid 1px ${borderColor}`,
      }}
    >
      {src ? <AvatarPicture alt={alt} src={src} /> : <NoProfilePicture />}
    </Container>
  )
}
