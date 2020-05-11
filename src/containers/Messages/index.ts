import { plateform } from 'src/utils/misc'
import { MessagesDesktop } from './Messages.desktop'
import { MessagesMobile } from './Messages.mobile'

export const Messages = plateform({
  Desktop: MessagesDesktop,
  Mobile: MessagesMobile,
})
