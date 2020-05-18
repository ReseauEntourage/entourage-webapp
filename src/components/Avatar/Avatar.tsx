import React from 'react'
import { colors } from 'src/styles'
import { Container, AvatarPicture, NoProfilePicture, Size } from './Avatar.styles'

interface AvatarProps {
  alt?: string;
  borderColor?: keyof typeof colors.main;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  size?: Size;
  src?: string | null;
  style?: React.CSSProperties;
}

export function Avatar(props: AvatarProps) {
  const {
    src,
    alt = 'Alt text',
    borderColor,
    style,
    className,
    onClick,
    size = 'small',
  } = props

  return (
    <Container
      className={className}
      onClick={onClick}
      style={{
        ...style,
        border: !borderColor ? undefined : `solid 1px ${borderColor}`,
      }}
    >
      {src ? <AvatarPicture alt={alt} size={size} src={src} /> : <NoProfilePicture size={size} />}
    </Container>
  )
}
