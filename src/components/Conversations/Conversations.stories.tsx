import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import random from 'lodash/random'
import React from 'react'
import { ButtonsList, Button } from 'src/components/Button'
import { colors } from 'src/styles'
import { loremIpsum } from 'src/utils/misc'
import { ConversationItem } from './ConversationItem'
import { Message } from './Message'
import { Messages } from './Messages'
import { PendingNotif } from './PendingNotif'

export default {
  title: 'Conversations',
  parameters: {
    component: null,
  },
}

export const ConversationItemDefault = () => (
  <ConversationItem
    excerpt={loremIpsum(10)}
    hasUnreadMessages={false}
    isActive={false}
    profilePictureURL="https://i.pravatar.cc/100"
    title={loremIpsum(10)}
  />
)

export const ConversationItemNewMessage = () => (
  <ConversationItem
    excerpt={loremIpsum(10)}
    hasUnreadMessages={true}
    isActive={false}
    profilePictureURL="https://i.pravatar.cc/100"
    title={loremIpsum(10)}
  />
)

export const MessageExternalUser = () => (
  <Message
    author="Jeanne B. Association pour l'amitié"
    authorAvatarURL="https://i.pravatar.cc/100"
    authorId={1}
    content={`
      Bonjour Mathieu,
      Oui j’ai hâte de voir ce vernissage, et nous venons à 3 colocs.
      Y a-t-il quelque chose que je peux apporter ?
    `}
    date={new Date().toISOString()}
    isMe={false}
  />
)

export const MessageMe = () => (
  <Message
    authorId={1}
    content={`
      Bonjour Mathieu,
      Oui j’ai hâte de voir ce vernissage, et nous venons à 3 colocs.
      Y a-t-il quelque chose que je peux apporter ?
    `}
    date={new Date().toISOString()}
    isMe={true}
  />
)

export const PendingNotifDefault = () => (
  <PendingNotif
    label={<div><b>Louise</b> souhaite participer</div>}
    pictureURL="https://i.pravatar.cc/100"
  />
)

export const PendingNotifMultipleRequest = () => (
  <PendingNotif
    label={<div>Plusieurs demandes en attentes</div>}
    pictureURL={['https://i.pravatar.cc/100', 'https://i.pravatar.cc/100']}
  />
)

export const PendingNotifWithRightContent = () => (
  <PendingNotif
    label={<div>Plusieurs demandes en attentes</div>}
    pictureURL={['https://i.pravatar.cc/100', 'https://i.pravatar.cc/100']}
    rightContent={(
      <ButtonsList>
        <Button startIcon={<CheckIcon />}>
            Accepter
        </Button>
        <Button startIcon={<CloseIcon />} style={{ backgroundColor: colors.main.white }} variant="outlined">
            Refuser
        </Button>
      </ButtonsList>
    )}
  />
)

function generateMessages() {
  return new Array(100).fill(null).map((value, index) => {
    const messageIndex = random(0, 1)

    if (messageIndex === 0) {
      return {
        authorName: 'John',
        authorId: 1,
        content: 'Conversation content',
        date: new Date().toISOString(),
        id: Date.now() + index,
      }
    }

    return {
      authorName: 'John',
      authorId: 2,
      content: 'Conversation content',
      date: new Date().toISOString(),
      id: Date.now() + index,
    }
  })
}

export const MessageDefault = () => (
  <div style={{ height: 400 }}>
    <Messages
      fetchMore={() => null}
      messages={generateMessages()}
      meUserId={1}
      onSendMessage={() => Promise.resolve()}
    />
  </div>
)
