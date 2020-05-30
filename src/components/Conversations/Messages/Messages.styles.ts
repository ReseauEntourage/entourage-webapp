import styled from 'styled-components'
import { theme } from 'src/styles'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`

export const MessageList = styled.div`
  flex: 1;
  position: relative;
  overflow: auto;
  padding: ${theme.spacing(2)}px;
`

export const BottomBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 ${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(2)}px;
  box-sizing: border-box;
`
