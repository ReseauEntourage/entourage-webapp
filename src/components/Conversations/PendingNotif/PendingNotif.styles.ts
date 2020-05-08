import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { Avatar as AvatarBase } from 'src/components/Avatar'
import { theme, colors, variants } from 'src/styles'

export const Container = styled.div`
  background-color: ${colors.main.second};
  display: flex;
  align-items: center;
  padding: ${theme.spacing(2)}px;
  border-radius: 5px;
`

export const Label = styled(Typography).attrs(() => ({
  color: 'textSecondary',
  variant: variants.bodyRegular,
  component: 'div',
}))`
  margin-left: ${theme.spacing(1)}px !important;
`

export const FlexGrow = styled.div`
  flex-grow: 1;
`

const Avatar = styled(AvatarBase)`
  position: absolute;
  width: 24px;
  height: 24px;
`

export const FirstAvatar = styled(Avatar)`
  top: 0;
  right: 0;
`

export const SecondAvatar = styled(Avatar)`
  left: 0;
  bottom: 0;
`

export const AvatarContainer = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
`
