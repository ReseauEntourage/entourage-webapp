import { Typography } from '@material-ui/core'
import React from 'react'
import { Button } from '../../components/Button'
import { texts } from '../../i18n'
import { variants } from 'src/styles'
import * as Nav from './Nav.styles'
import * as S from './NavNotificationBar.styles'

const throwMockError = () => {
  // Send false error to be caught by Sentry so we can open the feedback dialog
  if (process.env.NODE_ENV === 'production') {
    throw new Error('user-feedback')
  }
}

type FeedBackButtonProps = {
  closeDrawer?: Function;
}

export const FeedBackButton = (props: FeedBackButtonProps) => {
  const { closeDrawer } = props
  return (
    <Button
      onClick={() => {
        if (closeDrawer) closeDrawer()
        throwMockError()
      }}
      size="small"
    >
      {texts.nav.notificationBar.feedback}
    </Button>
  )
}

export function NotificationBar() {
  return (
    <S.NotificationBar variant="dense">
      <S.NotificationItem>
        <Typography
          color="textSecondary"
          variant={variants.bodyBold}
        >
          {texts.nav.notificationBar.welcome}
        </Typography>
      </S.NotificationItem>
      <Nav.Grow />
      <S.NotificationItem>
        <FeedBackButton />
      </S.NotificationItem>
    </S.NotificationBar>
  )
}
