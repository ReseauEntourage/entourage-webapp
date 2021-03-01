import { FieldErrors, FieldValues } from 'react-hook-form'
import React, { useCallback } from 'react'
import { Button } from 'src/components/Button'
import { constants } from 'src/constants'
import { texts } from 'src/i18n'
import { useModalSensitizationActions } from './useModalSensitizationActions'

interface ModalSensitizationActions {
  hasDismissed: boolean;
  setHasDismissed(value: boolean): void;
  getValues(): FieldValues;
  trigger(): void;
  errors: FieldErrors;
}

export function ModalSensitizationActions(props: ModalSensitizationActions) {
  const { hasDismissed, setHasDismissed, getValues, trigger, errors } = props

  const { onDismiss, onDismissWithFeedback, onWorkshopClick } = useModalSensitizationActions()
  const modalTexts = texts.content.modalSensitization

  const dismissWithFeedback = useCallback(async () => {
    await trigger()
    if (Object.keys(errors).length === 0) {
      onDismissWithFeedback(getValues().dismissReason)
    }
  }, [errors, getValues, onDismissWithFeedback, trigger])

  const dismiss = useCallback(() => {
    setHasDismissed(true)
  }, [setHasDismissed])

  if (hasDismissed) {
    return (
      <>
        <Button onClick={onDismiss} variant="outlined">
          {modalTexts.close}
        </Button>
        <Button onClick={dismissWithFeedback}>
          {modalTexts.send}
        </Button>
      </>
    )
  }

  return (
    <>
      <Button onClick={dismiss} variant="outlined">
        {modalTexts.dismiss}
      </Button>
      <Button href={constants.WORKSHOP_LINK} onClick={onWorkshopClick} target="_blank">
        {modalTexts.participate}
      </Button>
    </>
  )
}
