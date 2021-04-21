import * as Sentry from '@sentry/react'
import { env } from 'src/core/env'
import { texts } from 'src/i18n'

export function initSentry() {
  if (process.env.NODE_ENV !== 'production') return
  Sentry.init({
    dsn: env.SENTRY_DSN,
    beforeSend(event) {
      const isUserFeedbackFromBanner = event?.exception?.values?.some(((error) => error.value === 'user-feedback'))
      if (isUserFeedbackFromBanner) {
        Sentry.showReportDialog({
          eventId: event.event_id,
          lang: texts.nav.notificationBar.dialogLang,
          title: texts.nav.notificationBar.dialogTitle,
          subtitle: texts.nav.notificationBar.dialogSubtitle,
          subtitle2: texts.nav.notificationBar.dialogSubtitle2,
          labelComments: texts.nav.notificationBar.dialogLabelComments,
          labelSubmit: texts.nav.notificationBar.dialogLabelSubmit,
        })
      }
      return event
    },
  })
}
