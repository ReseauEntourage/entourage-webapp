import DateFnsUtils from '@date-io/date-fns'
import { Box, MenuItem, Select } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputAdornment from '@material-ui/core/InputAdornment'
import DescriptionIcon from '@material-ui/icons/Description'
import ImageIcon from '@material-ui/icons/Image'
import ListIcon from '@material-ui/icons/List'
import LoyaltyIcon from '@material-ui/icons/Loyalty'
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
} from '@material-ui/pickers'
import { isBefore, addHours, set } from 'date-fns'  // eslint-disable-line
import { fr } from 'date-fns/locale'  // eslint-disable-line

import { FormProvider } from 'react-hook-form'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Label, RowFields, SelectImage } from 'src/components/Form'

import {
  AutocompleteFormField,
  AutocompleteFormFieldKey,
  GoogleMapLocation,
} from 'src/components/GoogleMapLocation'
import { Modal } from 'src/components/Modal'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { useMutateCreateEntourages, useMutateUpdateEntourages } from 'src/core/store'
import { feedActions, selectEventImages, selectEventImagesFetching } from 'src/core/useCases/feed'
import { texts } from 'src/i18n'
import { useGetCurrentPosition, useMount } from 'src/utils/hooks'
import {
  assertIsDefined,
  getLocationFromPlace,
} from 'src/utils/misc'
import { DateISO } from 'src/utils/types'

interface FormField {
  [AutocompleteFormFieldKey]?: AutocompleteFormField;
  category: string;
  description: string;
  title: string;
  imageId: number;
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
    imageUrl?: string;
  };
}

export function ModalEditEvent(props: ModalEditEventProps) {
  const { event: existingEvent } = props

  const dispatch = useDispatch()

  const eventImages = useSelector(selectEventImages)
  const eventImagesFetching = useSelector(selectEventImagesFetching)

  const isCreation = !existingEvent

  const defaultImage = eventImages.find((eventImage) => eventImage.landscapeSmallUrl === existingEvent?.imageUrl)

  const defaultValues = {
    description: existingEvent?.description,
    title: existingEvent?.title,
    imageId: defaultImage?.id,
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

  useMount(() => {
    dispatch(feedActions.retrieveEventImages())
  })

  const onValidate = useCallback(async () => {
    if (!await trigger()) return false

    const {
      autocompletePlace,
      title,
      description,
      imageId,
    } = getValues()

    const updatedImage = eventImages.find((eventImage) => eventImage.id === imageId)

    console.log(imageId)
    console.log(updatedImage)

    const imageValuesToSend = {
      landscapeUrl: defaultImage?.landscapeUrl,
      landscapeThumbnailUrl: defaultImage?.landscapeSmallUrl,
      portraitUrl: defaultImage?.portraitUrl,
      portraitThumbnailUrl: defaultImage?.portraitSmallUrl,
    }

    if (existingEvent) {
      const locationMeta = autocompletePlace
        ? await getLocationFromPlace(autocompletePlace)
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
          ...imageValuesToSend,
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
      } = await getLocationFromPlace(autocompletePlace)

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
          ...imageValuesToSend,
        },
      }

      try {
        await createEntourage(event)
      } catch (error) {
        return false
      }
    }

    return true
  }, [trigger, getValues, eventImages, defaultImage, existingEvent, startDate, endDate, updateEntourage, createEntourage])

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
        <MuiPickersUtilsProvider locale={fr} utils={DateFnsUtils}>
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
                disableToolbar={false}
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
                disableToolbar={false}
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
          <Label>{modalTexts.step6}</Label>
          {
            eventImagesFetching
              ? <OverlayLoader />
              : (
                <SelectImage
                  fullWidth={true}
                  inputRef={register({
                    required: true,
                  })}
                  name={'imageId' as FormFieldKey}
                  options={eventImages.map((eventImage) => ({
                    image:
                      (
                        <Box alignItems="center" display="flex" justifyContent="center" width="100%">
                          <img alt={eventImage.title} src={eventImage.landscapeSmallUrl} width={300} />
                        </Box>
                      ),
                    value: eventImage.id,
                  }))}
                  placeholder={modalTexts.fieldDescriptionPlaceholder}
                  startAdornment={(
                    <InputAdornment position="start">
                      <ImageIcon />
                    </InputAdornment>
                  )}
                />
              )
          }
        </MuiPickersUtilsProvider>
      </FormProvider>
    </Modal>
  )
}
