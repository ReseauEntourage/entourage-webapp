import InputAdornment from '@material-ui/core/InputAdornment'
import EmailIcon from '@material-ui/icons/Email'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Label, RowFields, validators } from 'src/components/Form'
import {
  AutocompleteFormField,
  AutocompleteFormFieldKey,
  GoogleMapLocation,
} from 'src/components/GoogleMapLocation'
import { ImageCropper, ImageCropperValue } from 'src/components/ImageCropper'
import { Modal } from 'src/components/Modal'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { api, User } from 'src/core/api'
import { authUserActions, selectUserIsUpdating } from 'src/core/useCases/authUser'
import { notificationsActions } from 'src/core/useCases/notifications'
import { useMe } from 'src/hooks/useMe'
import { texts } from 'src/i18n'
import { useDelayLoadingNext, useGetCurrentPosition } from 'src/utils/hooks'
import { useLoadGoogleMapApi } from 'src/utils/misc'

interface FormField {
  about: User['about'];
  [AutocompleteFormFieldKey]?: AutocompleteFormField;
  email: User['email'];
  firstName: User['firstName'];
  lastName: User['lastName'];
}

type FormFieldKey = keyof FormField

function useUploadImageProfile() {
  const dispatch = useDispatch()
  const [imageCropperValue, setImageCropperValue] = useState<ImageCropperValue>()

  const uploadIfNeeded = useCallback(async () => {
    if (!imageCropperValue) return null

    try {
      const presignedURLResponse = await api.request({
        name: '/users/me/presigned_avatar_upload/ POST',
        data: {
          contentType: imageCropperValue.blob.type,
        },
      })

      await axios.put(presignedURLResponse.data.presignedUrl, imageCropperValue.blob, {
        headers: {
          'Content-Type': imageCropperValue.blob.type,
        },
      })

      return presignedURLResponse.data.avatarKey
    } catch (error) {
      dispatch(notificationsActions.addAlert({
        message: error?.message,
        severity: 'error',
      }))
      return null
    }
  }, [dispatch, imageCropperValue])

  return [
    setImageCropperValue,
    uploadIfNeeded,
  ] as [
    typeof setImageCropperValue,
    typeof uploadIfNeeded
  ]
}

export function ModalProfile() {
  const googleMapApiIsLoaded = useLoadGoogleMapApi()
  const isLoading = useDelayLoadingNext(!googleMapApiIsLoaded)

  if (isLoading) {
    return <OverlayLoader />
  }

  return googleMapApiIsLoaded
    ? <ModalProfileWithApi />
    : null
}

function ModalProfileWithApi() {
  const me = useMe()
  const [onValidateImageProfile, upload] = useUploadImageProfile()
  const closeOnNextRender = useSelector(selectUserIsUpdating)

  const dispatch = useDispatch()
  const user = me || {} as NonNullable<typeof me>

  const defaultValues = {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    about: user.about || '',
    email: user.email || '',
  }

  const {
    displayAddress,
    setDisplayAddress,
    getCurrentLocation,
    form,
  } = useGetCurrentPosition<FormField>(defaultValues as FormField, user.address?.displayAddress ?? '')

  const { register, trigger, setValue, getValues } = form

  const modalTexts = texts.content.profilModal

  const onValidate = useCallback(async () => {
    if (!await trigger()) {
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
      const avatarKey = (await upload()) ?? undefined

      const address = autocompletePlace && autocompletePlace.place ? {
        googleSessionToken: autocompletePlace.sessionToken,
        googlePlaceId: autocompletePlace.place.place_id,
      } : undefined

      const updatedUser = {
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
        about: about ?? undefined,
        email: email ?? undefined,
        avatarKey,
        address,
      }

      dispatch(authUserActions.updateUser(updatedUser))

      return false
    } catch (e) {
      return false
    }
  }, [dispatch, getValues, trigger, upload])

  useEffect(() => {
    register({ name: AutocompleteFormFieldKey as FormFieldKey })
  }, [register])

  const requiredInfoAreCompleted = !!(
    user.firstName?.trim()
    && user.lastName?.trim()
    && user.address?.displayAddress?.trim()
  )

  return (
    <Modal
      cancel={requiredInfoAreCompleted}
      closeOnNextRender={closeOnNextRender}
      onValidate={onValidate}
      title={modalTexts.modalTitle}
      validateLabel={texts.labels.save}
    >
      <FormProvider {...form}>
        <Label>
          {modalTexts.step1}
        </Label>
        <RowFields>
          <TextField
            fullWidth={true}
            inputRef={register({
              required: true,
              validate: {
                firstName: validators.firstName,
              },
            })}
            label={modalTexts.firstNameLabel}
            name={'firstName' as FormFieldKey}
            type="text"
          />
          <TextField
            fullWidth={true}
            inputRef={register({
              required: true,
              validate: {
                lastName: validators.lastName,
              },
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
          inputValue={displayAddress}
          onChange={(autocompletePlace) => {
            setDisplayAddress(autocompletePlace.place.description)
            setValue(AutocompleteFormFieldKey as FormFieldKey, autocompletePlace)
          }}
          onClickCurrentPosition={getCurrentLocation}
          textFieldProps={{
            label: modalTexts.locationLabel,
            name: 'address',
            inputRef: register({
              required: true,
            }),
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
            src={me?.avatarUrl}
          />
        </Label>
      </FormProvider>
    </Modal>
  )
}
