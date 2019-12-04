import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import useForm from 'react-hook-form'
import { TextField, validators, useCatchUnreadFormErrors } from 'src/components/Form'
import { GoogleMapLocation, GoogleMapLocationProps } from 'src/components/GoogleMapLocation'
import { Modal } from 'src/components/Modal'
import { theme } from 'src/styles'
import { texts } from 'src/i18n'
import { useQueryMe, useMutateMe } from 'src/network/queries'
import { User, schema } from 'src/network/api'

const Container = styled.div`
  width: 500px;
`

const Label = styled.div`
  margin-top: ${theme.spacing(2)}px;
`

const Names = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${theme.spacing(2)}px;
`

type SchemaUserUpdate = typeof schema['PATCH /users/me']['data']['user']

interface FormField {
  about: SchemaUserUpdate['about'];
  autocompletePlace: Parameters<GoogleMapLocationProps['onChange']>[0];
  email: SchemaUserUpdate['email'];
  firstName: SchemaUserUpdate['firstName'];
  lastName: SchemaUserUpdate['lastName'];
}

type FormFieldKey = keyof FormField

export function ProfileModal() {
  const { data: me } = useQueryMe()
  const [mutateMe] = useMutateMe()

  const user = (me && me.data && me.data.user) || {} as Partial<User>

  const { register, errors: plainErrors, triggerValidation, setValue, getValues } = useForm<FormField>({
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      about: user.about || '',
      email: user.email || '',
    },
  })

  const errors = useCatchUnreadFormErrors(plainErrors)

  const modalTexts = texts.content.profilModal

  const onValidate = useCallback(async () => {
    if (!await triggerValidation()) {
      return false
    }

    const {
      firstName,
      lastName,
      about,
      autocompletePlace,
      email,
    } = getValues()

    const address = autocompletePlace
      ? {
        googleSessionToken: autocompletePlace.googleSessionToken,
        googlePlaceId: autocompletePlace.place.place_id,
      } : undefined

    try {
      await mutateMe({
        firstName,
        lastName,
        about,
        address,
        email,
      })
      return true
    } catch (e) {
      return false
    }
  }, [getValues, mutateMe, triggerValidation])

  useEffect(() => {
    register({ name: 'autocompletePlace' as FormFieldKey })
  }, [register])

  return (
    <Modal
      title={modalTexts.modalTitle}
      validateLabel={texts.labels.save}
      onValidate={onValidate}
    >
      <Container>
        <Label>
          {modalTexts.step1}
        </Label>
        <Names>
          <TextField
            label={modalTexts.firstNameLabel}
            type="text"
            name={'firstName' as FormFieldKey}
            fullWidth={true}
            inputRef={register({
              required: true,
            })}
            formError={errors.firstName}
          />
          <TextField
            label={modalTexts.lastNameLabel}
            type="text"
            name={'lastName' as FormFieldKey}
            fullWidth={true}
            inputRef={register({
              required: true,
            })}
            formError={errors.lastName}
          />
        </Names>
        <Label>
          {modalTexts.step2}
        </Label>
        <TextField
          label={modalTexts.decriptionLabel}
          type="text"
          name={'about' as FormFieldKey}
          multiline={true}
          fullWidth={true}
          inputRef={register({
            required: true,
          })}
          formError={errors.about}
        />
        <Label>
          {modalTexts.step3}
        </Label>
        <GoogleMapLocation
          textFieldProps={{
            label: modalTexts.locationLabel,
            formError: errors.ss,
          }}
          onChange={(autocompletePlace) => setValue('autocompletePlace' as FormFieldKey, autocompletePlace)}
        />
        <Label>
          {modalTexts.step4}
        </Label>
        <TextField
          label={modalTexts.emailLabel}
          type="email"
          name={'email' as FormFieldKey}
          fullWidth={true}
          inputRef={register({
            required: true,
            validate: {
              email: validators.email,
            },
          })}
          formError={errors.email}
        />
      </Container>
    </Modal>
  )
}
