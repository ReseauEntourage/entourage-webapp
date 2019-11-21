import { createMuiTheme } from '@material-ui/core/styles'
import { colors } from './colors'

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.main.primary,
    },
    secondary: {
      main: colors.main.black,
    },
    error: {
      main: colors.main.red,
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    // header
    h2: {
      fontSize: 12,
      letterSpacing: 0.4,
      color: colors.main.second,
      fontWeight: 'bold',
    },
    subtitle1: {
      fontSize: 18,
      color: colors.main.second,
      letterSpacing: 0,
      fontWeight: 'bolder',
    },
    subtitle2: {
      fontSize: 14,
      color: colors.main.second,
      letterSpacing: 0,
      fontWeight: 'bolder',
    },
    body1: {
      fontSize: 14,
      color: colors.main.second,
      letterSpacing: 0,
      fontWeight: 'bolder',
    },
    body2: {
      fontSize: 14,
      color: colors.main.second,
      letterSpacing: 0,
    },
    caption: {
      fontSize: 12,
      color: colors.main.second,
      letterSpacing: 0,
    },
  },
})
