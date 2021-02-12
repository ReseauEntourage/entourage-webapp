import styled from 'styled-components'
import { colors, devices } from 'src/styles'

export const Container = styled.div`
  border-right: solid 1px #ccc;
  @media ${devices.desktop} {
    width: 400px;
  }
  @media ${devices.mobile} {
    width: 100%;
  }
  overflow-y: auto;
`

export const ListItem = styled.div`
  border-bottom: 1px ${colors.borderColor} solid;
`
