import { jestFn } from '../../utils/jestFn'
import { IMessagesGateway } from './IMessagesGateway'

export class TestMessagesGateway implements IMessagesGateway {
  retrieveConversations = jestFn<IMessagesGateway['retrieveConversations']>('retrieveMessages')

  retrieveConversationMessages =
  jestFn<IMessagesGateway['retrieveConversationMessages']>(
    'retrieveConversationMessages',
  )
}
