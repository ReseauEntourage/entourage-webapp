import { jestFn } from 'src/utils/jestFn'
import { IPOIsGateway } from './IPOIsGateway'

export class TestPOIsGateway implements IPOIsGateway {
  retrievePOIs = jestFn<IPOIsGateway['retrievePOIs']>('retrievePOIs')

  retrievePOI = jestFn<IPOIsGateway['retrievePOI']>('retrievePOI')
}
