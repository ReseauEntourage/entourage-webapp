import { jestFn } from '../../utils/jestFn'
import { IMessagesGateway } from './IMessagesGateway'

export class TestMessagesGateway implements IMessagesGateway {
  retrieveConversations = jestFn<IMessagesGateway['retrieveConversations']>('retrieveConversations')

  retrieveConversationMessages =
  jestFn<IMessagesGateway['retrieveConversationMessages']>(
    'retrieveConversationMessages',
  )

  sendMessage = jestFn<IMessagesGateway['sendMessage']>('sendMessage')
}
