import React from 'react'
import cogoToast from 'cogo-toast'
import Typography from '@material-ui/core/Typography'
import { AnyToFix } from 'src/types'
import { variants } from 'src/styles'

export function notifServerError(error: AnyToFix) {
  try {
    const { status, data } = error.response
    const errorMessage = `${status}: ${data.error.code} - ${data.error.message}`
    cogoToast.error(
      // @ts-ignore
      <Typography variant={variants.bodyBold}>
        Erreur: {errorMessage}
      </Typography>,
      { hideAfter: 5 },
    )
  } catch (e) {
    console.error(e)
    cogoToast.error(
      // @ts-ignore
      <Typography variant={variants.bodyBold}>
        Une erreur est survenue
      </Typography>,
      { hideAfter: 5 },
    )
  }
}

export function handleServerError(error: AnyToFix, fn: () => void | boolean) {
  try {
    if (fn()) {
      error.stopPropagation()
    }
  } catch (e) {
    console.error(e)
    // do nothing, error will be show
  }
}
