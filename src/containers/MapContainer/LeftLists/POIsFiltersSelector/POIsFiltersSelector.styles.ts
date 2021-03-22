import FilterListIconMUI from '@material-ui/icons/FilterList'

import styled from 'styled-components'
import { theme, colors } from 'src/styles'

export const MenuContainer = styled.div`
  a {
    text-decoration: none !important;
  }
`

export const FilterListButton = styled.div`
    outline: none;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: ${theme.spacing(2, 0, 2, 0)};
`

export const FilterListIcon = styled(FilterListIconMUI)`
    color: white;
    background-color: ${colors.main.primary};
    padding: 2px;
    border-radius: 14px;
`
