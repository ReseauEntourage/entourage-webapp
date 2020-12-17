import { Typography } from '@material-ui/core'
import styled from 'styled-components'
import { theme, devices, variants } from 'src/styles'

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

export const NoActions = styled(Typography).attrs(() => ({
  variant: variants.footNote,
}))`
  background-color: #F5F5F5;
  display: flex;
  padding: ${theme.spacing(1)}px;
  border-radius: 5px;
`
