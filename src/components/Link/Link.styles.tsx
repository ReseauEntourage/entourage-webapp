import Link from '@material-ui/core/Link'
import styled from 'styled-components'

export const StyledLink = styled(Link)`
  display: flex;
  &:hover {
    text-decoration: none !important;
    opacity: inherit !important;
  }
`

export const HoverableStyledLink = styled(Link)`
  display: flex;
  &:hover {
    text-decoration: none !important;
    opacity: 0.6 !important;
  }
`
