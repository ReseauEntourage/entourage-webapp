import Typography from '@material-ui/core/Typography'
import React from 'react'
import styled from 'styled-components'
import { formatRelative } from 'date-fns' // eslint-disable-line
import { fr } from 'date-fns/locale' // eslint-disable-line
import { Avatar } from 'src/components/Avatar'
import { theme, colors, variants } from 'src/styles'
import { DateISO } from 'src/types'

const Container = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-template-areas:
    '. author'
    'picture content'
    '. date';
  width: 100%;
`

const AvatarContainer = styled.div`
  grid-area: picture;
  align-self: end;
  margin-right: ${theme.spacing(1)}px;
`

const AuthorAndDate = styled(Typography).attrs(() => ({
  variant: variants.footNote,
  component: 'div',
}))`
  padding: ${theme.spacing(1)}px;
`

const Author = styled(AuthorAndDate)`
  grid-area: author;
`

const DateContainer = styled(AuthorAndDate)`
  grid-area: date;
`

const Content = styled(Typography).attrs(() => ({
  variant: variants.bodyRegular,
  component: 'div',
}))`
  grid-area: content;
  border-radius: ${theme.spacing(2)}px;
  padding: ${theme.spacing(2)}px;
  background-color: ${colors.main.greyLight};
`

interface MessageProps {
  author?: string;
  content: string;
  date: DateISO;
  isMe: boolean;
  picture?: string;
}

export function Message(props: MessageProps) {
  const { author, content, date, isMe } = props

  const formatedContent = content.split('\n').map((str, index) => <div key={`${str + index}`}>{str}</div>)

  const dateLabel = formatRelative(new Date(date), new Date(), { locale: fr })

  return (
    <Container>
      {!isMe && (
        <AvatarContainer>
          <Avatar />
        </AvatarContainer>
      )}
      {!isMe && <Author>{author}</Author>}
      <Content>{formatedContent}</Content>
      <DateContainer style={{ textAlign: isMe ? 'right' : 'left' }}>{dateLabel}</DateContainer>
    </Container>
  )
}
