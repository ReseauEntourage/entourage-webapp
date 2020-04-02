import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
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
