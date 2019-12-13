import styled from 'styled-components'

import { theme } from 'src/styles'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: ${theme.spacing(2)}px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  width: 100%;
`

export const MessagesContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  .ScrollToBottom {
    height: 100%;

    .ScrollToBottomButton {
      display: none;
    }
  }
`

export const MessageContainer = styled.div`
  display: flex;
  margin: ${theme.spacing(2)}px 0;
`

export const MessageWrapper = styled.div`
  max-width: 70%;
`

export const BottomBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`
