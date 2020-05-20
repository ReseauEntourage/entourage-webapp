import styled from 'styled-components'
import { theme } from 'src/styles'

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing(0, 1)};
  min-height: ${theme.mixins.toolbar.minHeight}px;
  justify-content: flex-start;
`
