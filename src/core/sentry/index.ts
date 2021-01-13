import * as Sentry from '@sentry/browser'
import { texts } from '../../i18n'
import { env } from 'src/core/env'

export function initSentry() {
  if (process.env.NODE_ENV === 'development') return
  Sentry.init({
    dsn: env.SENTRY_DSN,
    beforeSend(event) {
      if (
        !!(event?.exception?.values)
        && event.exception.values.length > 0
        && event.exception.values.some(((error) => error.value === 'user-feedback'))
      ) {
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
