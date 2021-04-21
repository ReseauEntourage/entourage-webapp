import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { variants } from 'src/styles'

export const MenuContainer = styled(Typography).attrs(() => ({
  variant: variants.bodyRegular,
  component: 'div',
}))`
  display: flex;
  justify-content: stretch;
  flex-direction: column;
`

export const Item = styled(MenuItem)`
  width: 100%
`
