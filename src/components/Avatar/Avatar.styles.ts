import AvatarMUI from '@material-ui/core/Avatar'
import styled, { css } from 'styled-components'
import { colors } from 'src/styles'

export type Size = 'small' | 'large'

function CSSGetSize() {
  return (props: { size: Size; }) => {
    const sizes = {
      small: 36,
      large: 56,
    }

    return css`
      height: ${sizes[props.size]}px;
      width: ${sizes[props.size]}px;
    `
  }
}

export const NoProfilePicture = styled.div<{ size: Size; }>`
  ${CSSGetSize()}
  border-radius: 100%;
  background-color: ${colors.main.primary};
`

export const Container = styled.div`
  border-radius: 100%;
`

export const AvatarPicture = styled(AvatarMUI)<{ size: Size; }>`
  ${CSSGetSize()}
  max-width: 100%;
  max-height: 100%;
`
