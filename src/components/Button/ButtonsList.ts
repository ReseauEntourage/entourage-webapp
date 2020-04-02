import styled from 'styled-components'
import { theme } from 'src/styles'

export const ButtonsList = styled.div`
  & > *:not(:first-child) {
    margin-left: ${theme.spacing(2)}px;
  }
`
