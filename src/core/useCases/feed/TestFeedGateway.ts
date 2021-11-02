import { jestFn } from '../../utils/jestFn'
import { IFeedGateway } from './IFeedGateway'

export class TestFeedGateway implements IFeedGateway {
  retrieveFeedItems = jestFn<IFeedGateway['retrieveFeedItems']>('retrieveFeedItems')

  retrieveFeedItem = jestFn<IFeedGateway['retrieveFeedItem']>('retrieveFeedItem')

  createEntourage = jestFn<IFeedGateway['createEntourage']>('createEntourage')

  updateEntourage = jestFn<IFeedGateway['updateEntourage']>('updateEntourage')

  joinEntourage = jestFn<IFeedGateway['joinEntourage']>('joinEntourage')

  leaveEntourage = jestFn<IFeedGateway['leaveEntourage']>('leaveEntourage')

  closeEntourage = jestFn<IFeedGateway['closeEntourage']>('closeEntourage')

  reopenEntourage = jestFn<IFeedGateway['reopenEntourage']>('reopenEntourage')

  retrieveEventImages = jestFn<IFeedGateway['retrieveEventImages']>('retrieveEventImages')
}
