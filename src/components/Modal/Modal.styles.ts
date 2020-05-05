
import { createGlobalStyle } from 'styled-components'
import { devices, theme } from 'src/styles'

export const GlobalStyle = createGlobalStyle`
  .MuiPaper-root {
    @media ${devices.mobile} {
      margin: ${theme.spacing(1)}px !important;
    }
  }

  .MuiDialog-paperScrollPaper {
    @media ${devices.mobile} {
      max-height: calc(100% - ${theme.spacing(2)}px) !important;
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
