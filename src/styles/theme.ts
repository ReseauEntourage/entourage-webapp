import { createMuiTheme } from '@material-ui/core/styles'
import { colors } from './colors'

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.main.primary,
    },
    secondary: {
      main: colors.main.white,
    },
    error: {
      main: '#f00',
    },
    background: {
      default: colors.main.white,
    },
    text: {
      primary: colors.main.greyishBrown,
      secondary: colors.main.white,
    },
  },
  typography: {
    // header
    h2: {
      fontSize: 12,
      letterSpacing: 0.4,
      color: colors.main.greyishBrown,
      fontWeight: 'bold',
    },
    subtitle1: {
      fontSize: 18,
      color: colors.main.greyishBrown,
      letterSpacing: 0,
      fontWeight: 'bolder',
    },
    subtitle2: {
      fontSize: 14,
      color: colors.main.greyishBrown,
      letterSpacing: 0,
      fontWeight: 'bolder',
    },
    body1: {
      fontSize: 14,
      color: colors.main.greyishBrown,
      letterSpacing: 0,
      fontWeight: 'bolder',
    },
    body2: {
      fontSize: 14,
      color: colors.main.greyishBrown,
      letterSpacing: 0,
    },
    caption: {
      fontSize: 12,
      color: colors.main.greyishBrown,
      letterSpacing: 0,
    },
  },
})
