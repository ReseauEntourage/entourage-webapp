import ToolbarMUI from '@material-ui/core/Toolbar'
import styled from 'styled-components'
import { theme, colors } from 'src/styles'

// TODO: Remove the ampersand (&) character in styled-components after removing of ThemeProvider of MUI.
// Goal: Prioritize the CSS rules of your styled-components over those of the JSS.
// See: https://www.sipios.com/blog-tech/how-to-use-styled-components-with-material-ui-in-a-react-app

export const NotificationBar = styled(ToolbarMUI)`
  && {
    background-color: ${colors.main.greyishBrown};
    color: ${colors.main.white};
  }
`

export const NotificationItem = styled.div`
  margin-left: ${theme.spacing(2)}px;
  display: flex;
  align-items: center;
`
