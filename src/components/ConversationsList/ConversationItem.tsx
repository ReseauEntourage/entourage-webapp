import Typography from '@material-ui/core/Typography'
import React from 'react'
import styled from 'styled-components'
import { colors, variants } from 'src/styles'
import { theme } from 'src/styles/theme'

const Container = styled.div<{ isActive: boolean; }>`
  display: flex;
  padding: ${theme.spacing(1)}px;
  align-items: center;
  border-bottom: solid 1px ${colors.borderColor};
  background-color: ${(props) => props.isActive && colors.main.greyLight};
`

const Picture = styled.div`
  margin-right: ${theme.spacing(1)}px;
`

const Texts = styled.div`
  overflow: hidden;
`

const Title = styled(Typography).attrs(() => ({
  variant: variants.title2,
}))`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const Excerpt = styled(Typography).attrs(() => ({
  variant: variants.footNote,
  component: 'div',
}))`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const NoProfilePicture = styled.div`
  height: 30px;
  width: 30px;
  border-radius: 30px;
  background-color: ${colors.main.primary};
`

interface ConversationItemProps {
  excerpt: string;
  isActive: boolean;
  profilePictureURL?: string;
  title: string;
}

export function ConversationItem(props: ConversationItemProps) {
  const { excerpt, profilePictureURL, title, isActive } = props

  return (
    <Container isActive={isActive}>
      <Picture>
        {profilePictureURL ? (
          <img alt="Profile" src={profilePictureURL} />
        ) : (
          <NoProfilePicture />
        )}
      </Picture>
      <Texts>
        <Title>{title}</Title>
        <Excerpt>{excerpt}</Excerpt>
      </Texts>
    </Container>
  )
}
