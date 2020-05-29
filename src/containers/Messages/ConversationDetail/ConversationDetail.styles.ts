import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { theme, variants } from 'src/styles'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
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

export const MessagesContainer = styled.div`
  flex: 1;
  overflow: hidden;
`
