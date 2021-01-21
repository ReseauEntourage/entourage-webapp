import React from 'react'
import { colors } from 'src/styles'
import * as S from './Avatar.styles'

interface AvatarProps {
  alt?: string;
  borderColor?: keyof typeof colors.main;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  size?: S.Size;
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
    <S.Container
      className={className}
      onClick={onClick}
      style={{
        ...style,
        border: !borderColor ? undefined : `solid 1px ${borderColor}`,
      }}
    >
      <S.AvatarPicture alt={alt} size={size} src={src || undefined}>
        <S.NoProfilePicture fontSize={S.iconSizes[size]} />
      </S.AvatarPicture>
    </S.Container>
  )
}
