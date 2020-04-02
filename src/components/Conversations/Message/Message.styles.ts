import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { theme, colors, variants } from 'src/styles'

export const Container = styled.div`
  max-width: 70%;
  display: grid;
  grid-template-columns: 40px auto;
  grid-template-areas:
    '. author'
    'picture content'
    '. date';
  grid-gap: ${theme.spacing(1)}px;
  min-width: 200px;
`

export const AvatarContainer = styled.div`
  grid-area: picture;
  align-self: end;
`

export const AuthorAndDate = styled(Typography).attrs(() => ({
  variant: variants.footNote,
  component: 'div',
}))`
  padding-left: ${theme.spacing(1)}px;
  padding-right: ${theme.spacing(1)}px;
`

export const Author = styled(AuthorAndDate)`
  grid-area: author;
`

export const DateContainer = styled(AuthorAndDate)`
  grid-area: date;
`

export const Content = styled(Typography).attrs(() => ({
  variant: variants.bodyRegular,
  component: 'div',
}))`
  grid-area: content;
  border-radius: ${theme.spacing(2)}px;
  padding: ${theme.spacing(2)}px;
  background-color: ${colors.main.greyLight};
  /* min-width: 200px; */
`

export const MessageContainer = styled.div`
  display: flex;
  margin: ${theme.spacing(2)}px 0;
`

export const MessageWrapper = styled.div`
  max-width: 70%;
`
