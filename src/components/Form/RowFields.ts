import styled from 'styled-components'
import { theme } from 'src/styles'

export const RowFields = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: ${theme.spacing(2)}px;
`
