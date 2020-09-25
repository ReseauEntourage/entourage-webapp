import Box from '@material-ui/core/Box'
import React, { useCallback, useState } from 'react'
import { Modal } from 'src/components/Modal'
import { api } from 'src/core/api'
import { useIsDesktop } from 'src/styles'
import { useDefinePasswordStep, DefinePasswordField } from './DefinePassword'
import { usePhoneStep, PhoneField } from './Phone'
import { useSecretStep, SecretField } from './Secret'

export type Step = 'phone' | 'code-SMS' | 'password' | 'define-password';

export type SetNextStep = (step: Step) => void;

interface ModalSignInProps {
  onSuccess?: () => void;
}

export function ModalSignIn(props: ModalSignInProps) {
  const { onSuccess } = props
  const [step, setStep] = useState<Step>('phone')
  const { phoneForm, onValidate: onValidatePhoneStep } = usePhoneStep(setStep)
  const { secretForm, onValidate: onValidateSecretStep } = useSecretStep(
    setStep,
    phoneForm,
  )
  const {
    definePasswordForm,
    onValidate: onValidateDefinePasswordStep,
  } = useDefinePasswordStep()
  const isDesktop = useIsDesktop()

  const onValidate = useCallback(async () => {
    if (step === 'phone') {
      return onValidatePhoneStep()
    }
    if (step === 'password' || step === 'code-SMS') {
      const isValid = await onValidateSecretStep()
      if (onSuccess && isValid) {
        onSuccess()
      }

      return isValid
    }
    if (step === 'define-password') {
      return onValidateDefinePasswordStep()
    }

    return false
  }, [
    onValidateDefinePasswordStep,
    onValidatePhoneStep,
    onValidateSecretStep,
    step,
    onSuccess,
  ])

  const resetPassword = React.useCallback(async () => {
    const { phone } = phoneForm.getValues()
    secretForm.reset()
    if (phone) {
      await api.request({
        name: '/users/me/code PATCH',
        data: {
          code: { action: 'regenerate' },
          user: { phone },
        },
      })
      setStep('code-SMS')
    }
  }, [phoneForm, secretForm])

  const validateLabel = (() => {
    switch (step) {
      case 'phone':
        return 'Valider le numéro'
      case 'code-SMS':
        return 'Valider le code SMS'
      case 'define-password':
        return 'Valider le mot de passe'
      case 'password':
        return 'Connexion'
      default:
        throw new Error('UNHANDLED')
    }
  })()

  const allowCancel = step !== 'define-password'

  return (
    <Modal
      cancel={allowCancel}
      onValidate={onValidate}
      title="Connexion / Inscription"
      validateLabel={validateLabel}
    >
      <Box style={{ paddingLeft: isDesktop ? 250 : 0 }}>
        {isDesktop && (
          <img
            alt="Personnage"
            src="/personnage-entourage-1.png"
            style={{
              position: 'absolute',
              left: 20,
              bottom: 0,
            }}
            width="200"
          />
        )}
        <PhoneField phoneForm={phoneForm} step={step} />
        <SecretField
          resetPassword={resetPassword}
          secretForm={secretForm}
          step={step}
        />
        <DefinePasswordField
          definePasswordForm={definePasswordForm}
          step={step}
        />
      </Box>
    </Modal>
  )
}
