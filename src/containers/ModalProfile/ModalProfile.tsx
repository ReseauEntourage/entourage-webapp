import InputAdornment from '@material-ui/core/InputAdornment'
import EmailIcon from '@material-ui/icons/Email'
import axios from 'axios'
import { FormContext } from 'react-hook-form'
import React, { useCallback, useEffect, useState } from 'react'
import { TextField, Label, RowFields, validators, useForm } from 'src/components/Form'
import { GoogleMapLocation, GoogleMapLocationProps } from 'src/components/GoogleMapLocation'
import { ImageCropper, ImageCropperValue } from 'src/components/ImageCropper'
import { Modal } from 'src/components/Modal'
import { api } from 'src/core/api'
import { useQueryMe, useMutateMe, useMutateMeAddress } from 'src/core/store'
import { texts } from 'src/i18n'
import { notifServerError } from 'src/utils/misc'

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

function useUploadImageProfile() {
  const [imageCropperValue, setImageCropperValue] = useState<ImageCropperValue>()

  const uploadIfNeeded = useCallback(async () => {
    if (!imageCropperValue) return null

    const presignedURLResponse = await api.request({
      name: '/users/me/presigned_avatar_upload/ POST',
      data: {
        contentType: imageCropperValue.blob.type,
      },
    })

    try {
      await axios.put(presignedURLResponse.data.presignedUrl, imageCropperValue.blob, {
        headers: {
          'Content-Type': imageCropperValue.blob.type,
        },
      })

      return presignedURLResponse.data.avatarKey
    } catch (error) {
      notifServerError(error)
      return null
    }
  }, [imageCropperValue])

  return [
    setImageCropperValue,
    uploadIfNeeded,
  ] as [
    typeof setImageCropperValue,
    typeof uploadIfNeeded
  ]
}

export function ModalProfile() {
  const { data: me } = useQueryMe()
  const [mutateMe] = useMutateMe()
  const [mutateMeAddress] = useMutateMeAddress(false)
  const [onValidateImageProfile, upload] = useUploadImageProfile()

  const user = me?.data?.user || {} as NonNullableUser

  const form = useForm<FormField>({
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      about: user.about || '',
      email: user.email || '',
    },
  })

  const { register, triggerValidation, setValue, getValues } = form

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

      const avatarKey = (await upload()) ?? undefined

      await mutateMe({
        firstName,
        lastName,
        about,
        email,
        avatarKey,
      })

      return true
    } catch (e) {
      return false
    }
  }, [getValues, mutateMe, mutateMeAddress, triggerValidation, upload])

  useEffect(() => {
    register({ name: 'autocompletePlace' as FormFieldKey })
  }, [register])

  const requiredInfoAreCompleted = !!(user.firstName && user.lastName && user.address?.displayAddress)

  return (
    <Modal
      cancel={requiredInfoAreCompleted}
      onValidate={onValidate}
      title={modalTexts.modalTitle}
      validateLabel={texts.labels.save}
    >
      <FormContext {...form}>
        <Label>
          {modalTexts.step1}
        </Label>
        <RowFields>
          <TextField
            fullWidth={true}
            inputRef={register({
              required: true,
            })}
            label={modalTexts.firstNameLabel}
            name={'firstName' as FormFieldKey}
            type="text"
          />
          <TextField
            fullWidth={true}
            inputRef={register({
              required: true,
            })}
            label={modalTexts.lastNameLabel}
            name={'lastName' as FormFieldKey}
            type="text"
          />
        </RowFields>
        <Label>
          {modalTexts.step2}
        </Label>
        <TextField
          fullWidth={true}
          inputRef={register}
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
          fullWidth={true}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
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
        <Label>
          {modalTexts.step5}
          <ImageCropper
            onValidate={onValidateImageProfile}
            src={me?.data.user.avatarUrl}
          />
        </Label>
      </FormContext>
    </Modal>
  )
}
