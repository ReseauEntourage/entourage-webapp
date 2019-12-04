import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import useForm from 'react-hook-form'
import { TextField, validators, useCatchUnreadFormErrors } from 'src/components/Form'
import { GoogleMapLocation, GoogleMapLocationProps } from 'src/components/GoogleMapLocation'
import { Modal } from 'src/components/Modal'
import { theme } from 'src/styles'
import { texts } from 'src/i18n'
import { useQueryMe, useMutateMe, useMutateMeAddress } from 'src/network/queries'

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

type UserUpdate = NonNullable<Parameters<ReturnType<typeof useMutateMe>[0]>[0]>

// we can force user to NonNullable because useQueryMe() always return a user in ProfileModal
// because ProfileModal is only open if user is not null
type NonNullableUser = NonNullable<ReturnType<typeof useQueryMe>['data']>['data']['user']

interface FormField {
  about: UserUpdate['about'];
  autocompletePlace?: Parameters<GoogleMapLocationProps['onChange']>[0];
  email: UserUpdate['email'];
  firstName: UserUpdate['firstName'];
  lastName: UserUpdate['lastName'];
}

type FormFieldKey = keyof FormField

export function ProfileModal() {
  const { data: me } = useQueryMe()
  const [mutateMe] = useMutateMe()
  const [mutateMeAddress] = useMutateMeAddress(false)

  const user = (me && me.data && me.data.user) || {} as NonNullableUser

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

    try {
      if (autocompletePlace && autocompletePlace.place) {
        await mutateMeAddress({
          googleSessionToken: autocompletePlace.googleSessionToken,
          googlePlaceId: autocompletePlace.place.place_id,
        })
      }

      await mutateMe({
        firstName,
        lastName,
        about,
        email,
      })

      return true
    } catch (e) {
      return false
    }
  }, [getValues, mutateMe, mutateMeAddress, triggerValidation])

  useEffect(() => {
    register({ name: 'autocompletePlace' as FormFieldKey })
  }, [register])

  return (
    <Modal
      onValidate={onValidate}
      title={modalTexts.modalTitle}
      validateLabel={texts.labels.save}
    >
      <Container>
        <Label>
          {modalTexts.step1}
        </Label>
        <Names>
          <TextField
            formError={errors.firstName}
            fullWidth={true}
            inputRef={register({
              required: true,
            })}
            label={modalTexts.firstNameLabel}
            name={'firstName' as FormFieldKey}
            type="text"
          />
          <TextField
            formError={errors.lastName}
            fullWidth={true}
            inputRef={register({
              required: true,
            })}
            label={modalTexts.lastNameLabel}
            name={'lastName' as FormFieldKey}
            type="text"
          />
        </Names>
        <Label>
          {modalTexts.step2}
        </Label>
        <TextField
          formError={errors.about}
          fullWidth={true}
          inputRef={register({
            required: true,
          })}
          label={modalTexts.decriptionLabel}
          multiline={true}
          name={'about' as FormFieldKey}
          type="text"
        />
        <Label>
          {modalTexts.step3}
        </Label>
        <GoogleMapLocation
          defaultValue={user.address ? user.address.displayAddress : ''}
          onChange={(autocompletePlace) => setValue('autocompletePlace' as FormFieldKey, autocompletePlace)}
          textFieldProps={{
            label: modalTexts.locationLabel,
          }}
        />
        <Label>
          {modalTexts.step4}
        </Label>
        <TextField
          formError={errors.email}
          fullWidth={true}
          inputRef={register({
            required: true,
            validate: {
              email: validators.email,
            },
          })}
          label={modalTexts.emailLabel}
          name={'email' as FormFieldKey}
          type="email"
        />
      </Container>
    </Modal>
  )
}
