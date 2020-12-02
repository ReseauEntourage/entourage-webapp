import styled from 'styled-components'
import { theme, devices } from 'src/styles'

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  @media ${devices.desktop} {
    margin: ${theme.spacing(2, 4)};
  }
`

export const ReopenContainer = styled.div`
  @media ${devices.desktop} {
    margin: ${theme.spacing(2, 4)};
  }
`

export const NoActionsSpan = styled.span`
  background-color: #F5F5F5;
  display: flex;
  padding: 9px;
  border-radius: 5px;
  font-size: 12px;
`
