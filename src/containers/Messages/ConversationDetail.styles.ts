import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { theme, variants, colors } from 'src/styles'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`

export const MessagesContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  margin: ${theme.spacing(2)}px;
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
  padding: ${theme.spacing(2)}px;
  box-sizing: border-box;
`

export const TopBar = styled(Typography).attrs(() => ({
  variant: variants.bodyRegular,
  color: 'primary',
  component: 'div',
}))`
  padding: ${theme.spacing(3)}px;
  border-bottom: solid 1px ${colors.borderColor};
`
