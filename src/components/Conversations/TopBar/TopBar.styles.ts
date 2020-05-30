import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { variants, theme, colors } from 'src/styles'

export const TopBarContainer = styled.div`
  display: flex;
  border-bottom: solid 1px ${colors.borderColor};
  align-items: center;
  cursor: pointer;
  padding: ${theme.spacing(0, 1)};
  min-height: ${theme.mixins.toolbar.minHeight}px;
`

export const TopBarTypography = styled(Typography).attrs(() => ({
  variant: variants.bodyRegular,
  color: 'primary',
  component: 'div',
}))`
  padding: ${theme.spacing(3)}px;
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

export const Icon = styled.div`
  margin-right: ${theme.spacing(2)}px;
`
