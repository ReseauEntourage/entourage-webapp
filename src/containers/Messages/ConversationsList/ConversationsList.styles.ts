import styled from 'styled-components'
import { devices } from 'src/styles'

export const Container = styled.div`
  border-right: solid 1px #ccc;
  @media ${devices.desktop} {
    max-width: 400px;
  }
  @media ${devices.mobile} {
    width: 100%;
  }
  overflow-y: auto;
`
