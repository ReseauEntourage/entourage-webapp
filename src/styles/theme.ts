import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'
import { styles } from './styles'

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#fff',
    },
    secondary: {
      main: styles.colors.primary,
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
})
