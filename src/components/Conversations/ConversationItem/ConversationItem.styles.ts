import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { colors, variants, theme } from 'src/styles'

export const Container = styled.div<{ isActive: boolean; }>`
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 100%;
  &:hover {
    background-color: ${colors.main.greyLight};
  }
  background-color: ${(props) => props.isActive && colors.main.greyLight};
`

export const ConversationContainer = styled.div`
  flex: 1;
  display: flex;
  padding: ${theme.spacing(3, 2)};
  align-items: center;
  // needed to make long titles ellipsis work
  width: 0;
`

export const Picture = styled.div`
  margin-right: ${theme.spacing(1)}px;
`

export const Texts = styled.div`
  overflow: hidden;
  text-align: left;
`

export const Title = styled(Typography).attrs(() => ({
  variant: variants.title1,
}))`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const Excerpt = styled(Typography).attrs(() => ({
  variant: variants.footNote,
  component: 'div',
}))<{ hasUnreadMessages: boolean; }>`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-weight: ${(props) => (props.hasUnreadMessages ? 'bold' : 'regular')} !important;
`

export const Dot = styled.div`
  background-color: ${colors.main.badgeRed};
  border-radius: 50%;
  width: 10px;
  height: 10px;
  margin-right: ${theme.spacing(3)}px;
`

