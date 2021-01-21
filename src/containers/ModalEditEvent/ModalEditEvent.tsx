import DateFnsUtils from '@date-io/date-fns'
import InputAdornment from '@material-ui/core/InputAdornment'
import DescriptionIcon from '@material-ui/icons/Description'
import LoyaltyIcon from '@material-ui/icons/Loyalty'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import { FormProvider } from 'react-hook-form'
import React, { useCallback, useEffect, useState } from 'react'
import { TextField, Label, RowFields, useForm } from 'src/components/Form'
import { GoogleMapLocation, GoogleMapLocationValue } from 'src/components/GoogleMapLocation'
import { Modal } from 'src/components/Modal'
import { useMutateCreateEntourages, useMutateUpdateEntourages } from 'src/core/store'
import { useI18n } from 'src/i18n'
import { getDetailPlacesService, assertIsString, assertIsNumber, assertIsDefined } from 'src/utils/misc'
import { DateISO } from 'src/utils/types'

interface FormField {
  autocompletePlace: GoogleMapLocationValue;
  category: string;
  description: string;
  title: string;
}

type FormFieldKey = keyof FormField

interface ModalEditEventProps {
  event?: {
    dateISO: DateISO;
    description: string;
    displayAddress: string;
    id: number;
    title: string;
  };
}

export function ModalEditEvent(props: ModalEditEventProps) {
  const { event: existingEvent } = props
  const texts = useI18n()

  const isCreation = !existingEvent

  const defaultValues = {
    description: existingEvent?.description,
    title: existingEvent?.title,
  }

  const form = useForm<FormField>({ defaultValues })
  const { register, trigger, getValues, setValue } = form
  const modalTexts = texts.content.modalEditEvent

  const defaultDate = existingEvent?.dateISO ? new Date(existingEvent?.dateISO) : new Date()
  const defaultTime = existingEvent?.dateISO ? new Date(existingEvent.dateISO).toLocaleTimeString('fr-FR') : '12:00'

  const [date, setDate] = useState(defaultDate)
  const [time, setTime] = useState(defaultTime)

  const onChangeDate = useCallback((nextDate) => {
    setDate(nextDate)
  }, [])

  const onChangeTime = useCallback((event) => {
    const { value } = event.target
    setTime(value)
  }, [])

  const [createEntourage] = useMutateCreateEntourages()
  const [updateEntourage] = useMutateUpdateEntourages()

  const onValidate = useCallback(async () => {
    if (!await trigger()) return false

    const formatedDate = date
    const [hours, minutes] = time.split(':')
    formatedDate.setHours(Number(hours))
    formatedDate.setMinutes(Number(minutes))

    const {
      autocompletePlace,
      title,
      description,
    } = getValues()

    const getLocation = async () => {
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
          startsAt: formatedDate.toISOString(),
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
          startsAt: formatedDate.toISOString(),
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
  }, [trigger, date, time, getValues, existingEvent, updateEntourage, createEntourage])

  useEffect(() => {
    register({ name: 'autocompletePlace' as FormFieldKey })
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
            defaultValue={existingEvent?.displayAddress}
            includeLatLng={true}
            onChange={(autocompletePlace) => setValue('autocompletePlace' as FormFieldKey, autocompletePlace)}
            textFieldProps={{
              placeholder: modalTexts.fieldAddressPlaceholder,
              name: 'action-address',
              inputRef: register({ required: true }),
            }}
          />
          {/* date and hour */}
          <Label>{modalTexts.step3}</Label>
          <RowFields>
            <KeyboardDatePicker
              disableToolbar={true}
              format="dd/MM/yyyy"
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              label={modalTexts.fieldLabelDate}
              margin="normal"
              onChange={onChangeDate}
              TextFieldComponent={(textFieldProps) => (
                <TextField {...textFieldProps} />
              )}
              value={date}
              variant="dialog"
            />
            <TextField
              id="time"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              label={modalTexts.fieldLabelTime}
              onChange={onChangeTime}
              type="time"
              value={time}
            />
          </RowFields>
          <Label>{modalTexts.step4}</Label>
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
