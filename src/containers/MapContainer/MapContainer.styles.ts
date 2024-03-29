import Box from '@material-ui/core/Box'
import FabMUI from '@material-ui/core/Fab'
import NavigationIcon from '@material-ui/icons/Navigation'
import styled from 'styled-components'
import { theme } from 'src/styles'

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`

export const NavIcon = styled(NavigationIcon)`
  margin-right: ${theme.spacing(2)};
`

export const FabFeed = styled(FabMUI)`
  position: fixed;
  bottom: ${theme.spacing(4)}px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  padding-right: ${theme.spacing(2)}px !important;
`

export const FabMap = styled(FabMUI)`
  position: absolute;
  top: ${theme.spacing(2)}px;
  left: ${theme.spacing(2)}px;
  padding-right: ${theme.spacing(2)}px !important;
  z-index: 2;
  `

export const MapContainer = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
`

export const RightCardsContainer = styled(Box)`
  width: 400px;
  z-index: 2;
`
