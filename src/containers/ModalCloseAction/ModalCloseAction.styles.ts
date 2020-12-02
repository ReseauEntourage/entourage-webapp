import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { variants } from 'src/styles'

export const Title = styled(Typography).attrs(() => ({
  variant: variants.title1,
}))`
  margin-top: 16px;
`
