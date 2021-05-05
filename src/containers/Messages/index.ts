import { plateform } from 'src/utils/misc'
import { MessagesDesktop } from './Messages.desktop'
import { MessagesMobile } from './Messages.mobile'

export { useEntourageUuid } from './useEntourageUuid'

export const Messages = plateform({
  Desktop: MessagesDesktop,
  Mobile: MessagesMobile,
})
