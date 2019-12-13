import React from 'react'
import { loremIpsum } from 'src/utils'
import { ConversationItem } from './ConversationItem'
import { Message } from './Message'

export default {
  title: 'Conversations',
}

export const ConversationsItemExample = () => (
  <div style={{ border: 'solid 1px #ccc', width: 300 }}>
    <ConversationItem
      excerpt={loremIpsum(10)}
      isActive={false}
      title={loremIpsum(10)}
    />
  </div>
)

export const MessageExample = () => (
  <div style={{ margin: 20, maxWidth: 500 }}>
    <Message
      author="Jeanne B. Association pour l'amitié"
      content={`
        Bonjour Mathieu,
        Oui j’ai hâte de voir ce vernissage, et nous venons à 3 colocs.
        Y a-t-il quelque chose que je peux apporter ?
      `}
      date={new Date().toISOString()}
      isMe={false}
    />
  </div>
)

export const MessageMeExample = () => (
  <div style={{ margin: 20, maxWidth: 500 }}>
    <Message
      content={`
        Bonjour Mathieu,
        Oui j’ai hâte de voir ce vernissage, et nous venons à 3 colocs.
        Y a-t-il quelque chose que je peux apporter ?
      `}
      date={new Date().toISOString()}
      isMe={true}
    />
  </div>
)
