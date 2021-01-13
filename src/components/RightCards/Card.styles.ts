import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { variants, colors } from 'src/styles'

export const Description = styled(Typography).attrs(() => ({
  variant: variants.bodyRegular,
}))`
  white-space: pre-line;
  a {
    color: ${colors.main.primary};
  }
`