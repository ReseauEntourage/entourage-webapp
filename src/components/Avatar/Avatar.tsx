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

interface AvatarProps {
  alt?: string;
  src?: string | null;
}

export function Avatar(props: AvatarProps) {
  const { src, alt = 'Alt text' } = props

  return src
    ? <AvatarMUI alt={alt} src={src} style={{ width: 36, height: 36 }} />
    : <NoProfilePicture />
}
