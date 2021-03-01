import styled from 'styled-components'
import { theme } from 'src/styles'

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing(2, 0)};
  box-sizing: border-box;
`

export const Scroll = styled.div`
  height: 100%;
  position: relative;
  overflow: auto;
`
