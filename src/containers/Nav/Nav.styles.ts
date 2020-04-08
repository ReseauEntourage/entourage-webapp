import styled from 'styled-components'
import { Button } from 'src/components/Button'
import { theme } from 'src/styles'

export const ConnectButton = styled(Button)`
  margin-left: ${theme.spacing(2)}px;
  & > * {
    margin-right: ${theme.spacing(1)}px;
  }
`
