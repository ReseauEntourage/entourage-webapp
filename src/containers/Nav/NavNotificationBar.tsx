import { Typography } from '@material-ui/core'
import { History } from '@material-ui/icons'
import React from 'react'
import { constants } from '../../constants'
import { texts } from '../../i18n'
import * as Nav from './Nav.styles'
import * as S from './NavNotificationBar.styles'

const throwMockError = () => {
  // Send false error to be caught by Sentry so we can open the feedback dialog
  if (process.env.NODE_ENV === 'production') {
    throw new Error('user-feedback')
  }
}

export function NotificationBar() {
  return (
    <S.NotificationBar variant="dense">
      <S.NotificationItem>
        <Typography
          color="textSecondary"
          variant="body1"
        >
          {texts.nav.notificationBar.welcome}
        </Typography>
      </S.NotificationItem>
      <S.NotificationItem>
        <S.WhiteOutlinedButton
          onClick={throwMockError}
          size="small"
        >
          {texts.nav.notificationBar.feedback}
        </S.WhiteOutlinedButton>
      </S.NotificationItem>

      <Nav.Grow />
      <Nav.NavItem
        color="textSecondary"
        href={constants.LEGACY_WEB_APP_URL}
        icon={<History fontSize="small" />}
        label={texts.nav.notificationBar.back}
      />
    </S.NotificationBar>
  )
}
