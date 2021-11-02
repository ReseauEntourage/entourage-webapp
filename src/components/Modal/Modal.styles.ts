import IconButton from '@material-ui/core/IconButton'
import styled, { createGlobalStyle } from 'styled-components'
import { devices, theme } from 'src/styles'

export const GlobalStyle = createGlobalStyle`
  .MuiDialog-paperScrollPaper {
    @media ${devices.mobile} {
      max-height: calc(100% - ${theme.spacing(2)}px) !important;
      margin: ${theme.spacing(1)}px !important;
    }
  }

  .MuiDialogContent-root {
    @media ${devices.mobile} {
      padding: ${theme.spacing(1, 1)} !important;
    }
  }

  .MuiDialogActions-root {
    @media ${devices.desktop} {
      padding: ${theme.spacing(2, 4)} !important;
    }

    @media ${devices.mobile} {
      padding: ${theme.spacing(1, 2)} !important;
    }
  }
`

export const CloseIconContainer = styled(IconButton)`
  position: absolute !important;
  right: ${theme.spacing(1)}px !important;
  top: ${theme.spacing(1)}px !important;
`
