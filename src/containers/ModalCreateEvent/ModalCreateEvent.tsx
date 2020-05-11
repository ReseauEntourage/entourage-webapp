import DateFnsUtils from '@date-io/date-fns'
import InputAdornment from '@material-ui/core/InputAdornment'
import DescriptionIcon from '@material-ui/icons/Description'
import LoyaltyIcon from '@material-ui/icons/Loyalty'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import { FormContext } from 'react-hook-form'
import React, { useCallback, useEffect, useState } from 'react'
import { TextField, Label, RowFields, useForm } from 'src/components/Form'
import { GoogleMapLocation, GoogleMapLocationValue } from 'src/components/GoogleMapLocation'
import { Modal } from 'src/components/Modal'
import { useMutateEntourages } from 'src/core/store'
import { texts } from 'src/i18n'
import { getDetailPlacesService, assertIsString, assertIsNumber } from 'src/utils/misc'

interface FormField {
  autocompletePlace: GoogleMapLocationValue;
  category: string;
  description: string;
  title: string;
}

type FormFieldKey = keyof FormField

export function ModalCreateEvent() {
  const form = useForm<FormField>()
  const { register, triggerValidation, getValues, setValue } = form
  const modalTexts = texts.content.modalCreateEvent

  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState('12:00')

  const onChangeDate = useCallback((nextDate) => {
    setDate(nextDate)
  }, [])

  const onChangeTime = useCallback((event) => {
    const { value } = event.target
    setTime(value)
  }, [])

  const [createEntourage] = useMutateEntourages()

  const onValidate = useCallback(async () => {
    if (!await triggerValidation()) return false

    const formatedDate = date
    const [hours, minutes] = time.split(':')
    formatedDate.setHours(Number(hours))
    formatedDate.setMinutes(Number(minutes))

    const {
      autocompletePlace,
      title,
      description,
    } = getValues()

    const placeDetail = await getDetailPlacesService(
      autocompletePlace.place.place_id,
      autocompletePlace.googleSessionToken,
    )

    const latitude = placeDetail.geometry?.location.lat()
    const longitude = placeDetail.geometry?.location.lng()
    const googlePlaceId = autocompletePlace.place.place_id
    const streetAddress = placeDetail.formatted_address

    assertIsNumber(latitude)
    assertIsNumber(longitude)
    assertIsString(streetAddress)

    const action = {
      title,
      description,
      groupType: 'outing',
      location: {
        latitude,
        longitude,
      },
      metadata: {
        googlePlaceId,
        startsAt: formatedDate.toISOString(),
        placeName: placeDetail.name,
        streetAddress,
      },
    }

    try {
      await createEntourage(action)
    } catch (error) {
      return false
    }

    return true
  }, [createEntourage, getValues, triggerValidation, date, time])

  useEffect(() => {
    register({ name: 'autocompletePlace' as FormFieldKey })
  }, [register])

  return (
    <Modal
      onValidate={onValidate}
      title={modalTexts.title}
      validateLabel={modalTexts.validateLabel}
    >
      <FormContext {...form}>
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
              format="MM/dd/yyyy"
              id="date-picker-inline"
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              label="Date picker inline"
              margin="normal"
              onChange={onChangeDate}
              TextFieldComponent={(props) => (
                <TextField {...props} />
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
              label="Alarm clock"
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
      </FormContext>
    </Modal>
  )
}
