import { jestFn } from '../../utils/jestFn'
import { IMessagesGateway } from './IMessagesGateway'

export class TestMessagesGateway implements IMessagesGateway {
  retrieveConversations = jestFn<IMessagesGateway['retrieveConversations']>('retrieveConversations')

  retrieveConversationMessages = jestFn<IMessagesGateway['retrieveConversationMessages']>(
    'retrieveConversationMessages',
  )

  retrieveConversation = jestFn<IMessagesGateway['retrieveConversation']>(
    'retrieveConversation',
  )

  sendMessage = jestFn<IMessagesGateway['sendMessage']>('sendMessage')
}
