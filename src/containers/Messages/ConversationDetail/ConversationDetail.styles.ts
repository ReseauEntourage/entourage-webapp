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
  /* overflow: hidden; */
  overflow: auto;
  margin: ${theme.spacing(2)}px;
  .ScrollToBottom {
    height: 100%;

    .ScrollToBottomButton {
      display: none;
    }
  }
`

export const BottomBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 ${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(2)}px;
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

export const Pending = styled(Typography).attrs(() => ({
  variant: variants.bodyRegular,
  component: 'div',
}))`
  padding: ${theme.spacing(3)}px;
  text-align: center;
  flex: 1;
  display: flex;
  justify-content: center;
`
