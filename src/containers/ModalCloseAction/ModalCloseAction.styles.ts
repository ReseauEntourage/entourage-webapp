import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { variants, theme } from 'src/styles'

export const Title = styled(Typography).attrs(() => ({
  variant: variants.title1,
}))`
  margin-top: ${theme.spacing(2)}px;
`
