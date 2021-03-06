import { plateform } from 'src/utils/misc'
import { SendButtonDesktop } from './SendButton.desktop'
import { SendButtonMobile } from './SendButton.mobile'

export interface SendButtonProps {
  disabled?: boolean;
  onClick: () => Promise<void>;
}

export const SendButton = plateform({
  Desktop: SendButtonDesktop,
  Mobile: SendButtonMobile,
})
