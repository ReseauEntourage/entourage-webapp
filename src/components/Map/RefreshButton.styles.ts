import FabMUI from '@material-ui/core/Fab'
import { Refresh } from '@material-ui/icons'
import styled from 'styled-components'
import { devices, theme } from 'src/styles'

export const FabRefresh = styled(FabMUI)`
  padding-right: ${theme.spacing(2)}px !important;
`

export const FabContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: ${theme.spacing(2)}px;
  left: 0;
  right: 0;
  z-index: 2;
  @media ${devices.mobile} {
    top: inherit;
    bottom: ${theme.spacing(2)}px;
  }
`

export const RefreshIcon = styled(Refresh)`
  margin-right: ${theme.spacing(1)}px;
`
