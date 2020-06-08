import styled from 'styled-components'
import { theme, devices } from 'src/styles'

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing(2, 0)};
  box-sizing: border-box;
`

export const Scroll = styled.div`
  position: relative;
  overflow: auto;
`

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  @media ${devices.desktop} {
    margin: ${theme.spacing(2, 4)};
  }
`
