import AppBarMUI from '@material-ui/core/AppBar'
import styled from 'styled-components'
import { Button } from 'src/components/Button'
import { theme, colors } from 'src/styles'
import { NavItem as NotStyledNavItem } from './NavItem'

// TODO: Remove the ampersand (&) character in styled-components after removing of ThemeProvider of MUI.
// Goal: Prioritize the CSS rules of your styled-components over those of the JSS.
// See: https://www.sipios.com/blog-tech/how-to-use-styled-components-with-material-ui-in-a-react-app

export const ConnectButton = styled(Button)`
  & > * {
    margin-right: ${theme.spacing(1)}px;
  }
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`

export const NavItem = styled(NotStyledNavItem)`
  margin-left: ${theme.spacing(2)}px;
  margin-right: ${theme.spacing(2)}px;
`

export const AppBar = styled(AppBarMUI)`
  && {
    background-color: ${colors.main.white};
    border-bottom: solid 1px ${colors.main.borderColorNav};
    color: ${colors.main.text};
  }
`

export const AccountContainer = styled.div`
  margin-left: ${theme.spacing(4)}px;
`

export const Grow = styled.div`
  flex-grow: 1;
`
