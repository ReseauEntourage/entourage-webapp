import * as Sentry from '@sentry/browser'
import { env } from 'src/core/env'

export function initSentry() {
  if (process.env.NODE_ENV === 'development') return
  Sentry.init({
    dsn: env.SENTRY_DSN,
  })
}
