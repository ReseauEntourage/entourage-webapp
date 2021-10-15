import AvatarMUI from '@material-ui/core/Avatar'
import { SvgIconProps } from '@material-ui/core/SvgIcon'
import { Person } from '@material-ui/icons'
import styled, { css } from 'styled-components'
import { colors, theme } from 'src/styles'

export type Size = 'small' | 'large'

export const iconSizes: Record<Size, SvgIconProps['fontSize']> = {
  small: 'medium',
  large: 'large',
}

function CSSGetSize() {
  return (props: { size: Size; }) => {
    const sizes = {
      small: theme.spacing(5),
      large: theme.spacing(10),
    }

    return css`
      height: ${sizes[props.size]}px;
      width: ${sizes[props.size]}px;
    `
  }
}

export const NoProfilePicture = styled(Person)`
  color: ${colors.main.greyishBrown};
`

export const Container = styled.div`
  border-radius: 100%;
  cursor: ${(props) => props.onClick && 'pointer'};
`

export const AvatarPicture = styled(AvatarMUI)<{ size: Size; }>`
  ${CSSGetSize()}
  max-width: 100%;
  max-height: 100%;
  background-color: ${colors.main.greyLight} !important;
`
