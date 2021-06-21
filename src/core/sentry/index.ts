import * as Sentry from '@sentry/react'
import { env } from 'src/core/env'

export function initSentry() {
  if (process.env.NODE_ENV !== 'production') return
  Sentry.init({
    dsn: env.SENTRY_DSN,
  })
}
