import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import React, { useState, useRef, useEffect } from 'react'
import { Step } from '../ModalSignIn'
import { TextField } from 'src/components/Form'
import * as S from './Secret.styles'
import { useSecretStep } from './useSecretStep'

type SecretForm = ReturnType<
typeof useSecretStep
>['secretForm'];

interface SecretFieldProps {
  resetPassword: () => void;
  secretForm: SecretForm;
  step: Step;
}

export function SecretField(props: SecretFieldProps) {
  const { secretForm, step, resetPassword } = props
  const secretTypeRef = useRef<'password' | 'code-SMS'>()
  const secretTypeDone = secretTypeRef.current && step !== 'code-SMS' && step !== 'password'
  const secretTypeActive = step === 'code-SMS' || step === 'password'
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)

  useEffect(() => {
    if (step === 'password' || step === 'code-SMS') {
      secretTypeRef.current = step
    }
  }, [step])

  if (!secretTypeActive && !secretTypeDone) {
    return null
  }

  return (
    <>
      <TextField
        autoFocus={true}
        disabled={secretTypeDone}
        formErrors={secretForm.errors}
        fullWidth={true}
        InputProps={{ // <-- This is where the toggle button is added.
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                disabled={secretTypeDone}
                onClick={handleClickShowPassword}
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        inputRef={secretForm.register({
          required: true,
        })}
        label={
          step === 'password'
            ? 'Entre votre mot de passe (au moins 8 caractères)'
            : 'Entrez le code d\'activation reçu'
        }
        name="secret"
        type={showPassword ? 'text' : 'password'}
      />
      <S.ForgottenPasswordLink onClick={resetPassword}>
        {step === 'password' ? 'Mot de passe oublié ?' : "Renvoyer le code d'activation"}
      </S.ForgottenPasswordLink>
    </>
  )
}
