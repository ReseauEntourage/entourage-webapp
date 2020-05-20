import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { variants, theme, colors } from 'src/styles'

export const TopBarContainer = styled.div`
  display: flex;
  border-bottom: solid 1px ${colors.borderColor};
  align-items: center;
  cursor: pointer;
`
export const TopBarTypography = styled(Typography).attrs(() => ({
  variant: variants.bodyRegular,
  color: 'primary',
  component: 'div',
}))`
  padding: ${theme.spacing(3)}px;
`

export const Icon = styled.div`
  margin-right: ${theme.spacing(2)}px;
`
