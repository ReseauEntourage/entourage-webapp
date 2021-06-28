import DateFnsUtils from '@date-io/date-fns'
import InputAdornment from '@material-ui/core/InputAdornment'
import DescriptionIcon from '@material-ui/icons/Description'
import LoyaltyIcon from '@material-ui/icons/Loyalty'
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
} from '@material-ui/pickers'
import { isBefore, addHours, set } from 'date-fns'

import { FormProvider } from 'react-hook-form'
import React, { useCallback, useEffect, useState } from 'react'
import { TextField, Label, RowFields } from 'src/components/Form'
import {
  AutocompleteFormField,
  AutocompleteFormFieldKey,
  GoogleMapLocation,
} from 'src/components/GoogleMapLocation'
import { Modal } from 'src/components/Modal'
import { useMutateCreateEntourages, useMutateUpdateEntourages } from 'src/core/store'
import { texts } from 'src/i18n'
import { useGetCurrentPosition } from 'src/utils/hooks'
import { getDetailPlacesService, assertIsString, assertIsNumber, assertIsDefined } from 'src/utils/misc'
import { DateISO } from 'src/utils/types'

interface FormField {
  [AutocompleteFormFieldKey]?: AutocompleteFormField;
  category: string;
  description: string;
  title: string;
}

type FormFieldKey = keyof FormField

interface ModalEditEventProps {
  event?: {
    startDateISO: DateISO;
    endDateISO?: DateISO;
    description: string;
    displayAddress: string;
    id: number;
    title: string;
  };
}

export function ModalEditEvent(props: ModalEditEventProps) {
  const { event: existingEvent } = props

  const isCreation = !existingEvent

  const defaultValues = {
    description: existingEvent?.description,
    title: existingEvent?.title,
  }

  const {
    displayAddress,
    setDisplayAddress,
    getCurrentLocation,
    form,
  } = useGetCurrentPosition<FormField>(defaultValues as FormField, existingEvent?.displayAddress ?? '')

  const { register, trigger, getValues, setValue } = form

  const modalTexts = texts.content.modalEditEvent

  const defaultStartDate = existingEvent?.startDateISO
    ? new Date(existingEvent?.startDateISO)
    : set(new Date(), {
      hours: 12,
      minutes: 0,
      seconds: 0,
    })

  const futureDate = addHours(defaultStartDate, 3)

  const defaultEndDate = existingEvent?.endDateISO ? new Date(existingEvent?.endDateISO) : futureDate

  const [startDate, setStartDate] = useState(defaultStartDate)

  const [endDate, setEndDate] = useState(defaultEndDate)

  const onChangeStartDate = useCallback((nextDate) => {
    setStartDate(nextDate)
    if (isBefore(endDate, nextDate)) {
      const futureEndDate = addHours(nextDate, 3)
      setEndDate(futureEndDate)
    }
  }, [endDate])

  const onChangeEndDate = useCallback((nextDate) => {
    if (isBefore(nextDate, startDate)) {
      setEndDate(startDate)
    } else {
      setEndDate(nextDate)
    }
  }, [startDate])

  const [createEntourage] = useMutateCreateEntourages()
  const [updateEntourage] = useMutateUpdateEntourages()

  const onValidate = useCallback(async () => {
    if (!await trigger()) return false

    const {
      autocompletePlace,
      title,
      description,
    } = getValues()

    const getLocation = async () => {
      assertIsDefined(autocompletePlace)

      const placeDetail = await getDetailPlacesService(
        autocompletePlace.place.place_id,
        autocompletePlace.sessionToken,
      )

      const latitude = placeDetail.geometry?.location.lat()
      const longitude = placeDetail.geometry?.location.lng()
      const googlePlaceId = autocompletePlace.place.place_id
      const streetAddress = placeDetail.formatted_address
      const placeName = placeDetail.name

      assertIsNumber(latitude)
      assertIsNumber(longitude)
      assertIsString(streetAddress)

      return {
        location: {
          latitude,
          longitude,
        },
        googlePlaceId,
        streetAddress,
        placeName,
      }
    }

    if (existingEvent) {
      const locationMeta = autocompletePlace
        ? await getLocation()
        : null

      const event = {
        id: existingEvent.id,
        title,
        description,
        location: locationMeta?.location,
        metadata: {
          googlePlaceId: locationMeta?.googlePlaceId,
          startsAt: startDate.toISOString(),
          endsAt: endDate.toISOString(),
          placeName: locationMeta?.placeName,
          streetAddress: locationMeta?.streetAddress,
        },
      }

      try {
        await updateEntourage(event)
      } catch (error) {
        return false
      }
    } else {
      assertIsDefined(autocompletePlace)

      const {
        location,
        googlePlaceId,
        streetAddress,
        placeName,
      } = await getLocation()

      const event = {
        title,
        description,
        groupType: 'outing',
        location,
        metadata: {
          googlePlaceId,
          startsAt: startDate.toISOString(),
          endsAt: endDate.toISOString(),
          placeName,
          streetAddress,
        },
      }

      try {
        await createEntourage(event)
      } catch (error) {
        return false
      }
    }

    return true
  }, [trigger, startDate, endDate, getValues, existingEvent, updateEntourage, createEntourage])

  useEffect(() => {
    register({ name: AutocompleteFormFieldKey as FormFieldKey })
  }, [register])

  return (
    <Modal
      onValidate={onValidate}
      title={modalTexts.title}
      validateLabel={isCreation ? modalTexts.validateLabelCreate : modalTexts.validateLabelUpdate}
    >
      <FormProvider {...form}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Label>{modalTexts.step1}</Label>
          <TextField
            fullWidth={true}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LoyaltyIcon />
                </InputAdornment>
              ),
            }}
            inputRef={register({
              required: true,
            })}
            // label={modalTexts.fieldLabelTitle}
            name={'title' as FormFieldKey}
            placeholder={modalTexts.fieldTitlePlaceholder}
            type="text"
          />
          <Label>{modalTexts.step2}</Label>
          <GoogleMapLocation
            inputValue={displayAddress}
            onChange={(autocompletePlace) => {
              setDisplayAddress(autocompletePlace.place.description)
              setValue(AutocompleteFormFieldKey as FormFieldKey, autocompletePlace)
            }}
            onClickCurrentPosition={getCurrentLocation}
            textFieldProps={{
              placeholder: modalTexts.fieldAddressPlaceholder,
              name: 'action-address',
              inputRef: register({ required: true }),
            }}
          />
          {/* date and hour */}
          <RowFields>
            <div>
              <Label>{modalTexts.step3}</Label>
              <DateTimePicker
                ampm={false}
                disablePast={true}
                disableToolbar={true}
                format="'Le' dd/MM/yyyy à HH'h'mm"
                fullWidth={true}
                label={modalTexts.fieldLabelStartDate}
                margin="normal"
                onChange={onChangeStartDate}
                TextFieldComponent={(textFieldProps) => (
                  <TextField {...textFieldProps} />
                )}
                value={startDate}
                variant="dialog"
              />
            </div>
            <div>
              <Label>{modalTexts.step4}</Label>
              <DateTimePicker
                ampm={false}
                disablePast={true}
                disableToolbar={true}
                format="'Le' dd/MM/yyyy à HH'h'mm"
                fullWidth={true}
                label={modalTexts.fieldLabelEndDate}
                margin="normal"
                minDate={startDate}
                onChange={onChangeEndDate}
                TextFieldComponent={(textFieldProps) => (
                  <TextField {...textFieldProps} />
                )}
                value={endDate}
                variant="dialog"
              />
            </div>

          </RowFields>

          <Label>{modalTexts.step5}</Label>
          <TextField
            fullWidth={true}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon />
                </InputAdornment>
              ),
            }}
            inputRef={register({
              required: true,
            })}
            multiline={true}
            name={'description' as FormFieldKey}
            placeholder={modalTexts.fieldDescriptionPlaceholder}
            rows="4"
            type="text"
          />
        </MuiPickersUtilsProvider>
      </FormProvider>
    </Modal>
  )
}
