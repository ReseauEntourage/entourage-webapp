import React from 'react'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { loremIpsum } from 'src/utils'
import { ConversationItem } from './ConversationItem'
import { Message } from './Message'
import { PendingNotif } from './PendingNotif'

export default {
  title: 'Conversations',
}

export const Conversations = () => (
  <>
    <TransparentWrapper style={{ width: 300 }}>
      <ConversationItem
        excerpt={loremIpsum(10)}
        isActive={false}
        profilePictureURL="https://i.pravatar.cc/100"
        title={loremIpsum(10)}
      />
      <ConversationItem
        excerpt={loremIpsum(10)}
        isActive={false}
        profilePictureURL="https://i.pravatar.cc/100"
        title={loremIpsum(10)}
      />
      <ConversationItem
        excerpt={loremIpsum(10)}
        isActive={false}
        profilePictureURL="https://i.pravatar.cc/100"
        title={loremIpsum(10)}
      />
    </TransparentWrapper>
    <TransparentWrapper>
      <Message
        author="Jeanne B. Association pour l'amitié"
        content={`
          Bonjour Mathieu,
          Oui j’ai hâte de voir ce vernissage, et nous venons à 3 colocs.
          Y a-t-il quelque chose que je peux apporter ?
        `}
        date={new Date().toISOString()}
        isMe={false}
        picture="https://i.pravatar.cc/100"
      />
    </TransparentWrapper>
    <TransparentWrapper>
      <Message
        content={`
          Bonjour Mathieu,
          Oui j’ai hâte de voir ce vernissage, et nous venons à 3 colocs.
          Y a-t-il quelque chose que je peux apporter ?
        `}
        date={new Date().toISOString()}
        isMe={true}
      />
    </TransparentWrapper>
    <TransparentWrapper>
      <PendingNotif
        label={<div><b>Louise</b> souhaite participer</div>}
      />
    </TransparentWrapper>
    <TransparentWrapper>
      <PendingNotif
        label={<div><b>Louise</b> souhaite participer</div>}
        pictureURL="https://i.pravatar.cc/100"
      />
    </TransparentWrapper>
    <TransparentWrapper>
      <PendingNotif
        label={<div>Plusieurs demandes en attentes</div>}
        pictureURL={['https://i.pravatar.cc/100', 'https://i.pravatar.cc/100']}
      />
    </TransparentWrapper>
  </>
)
