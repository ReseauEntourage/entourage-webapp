import DateFnsUtils from '@date-io/date-fns'
import { Box } from '@material-ui/core'
import InputAdornment from '@material-ui/core/InputAdornment'
import DescriptionIcon from '@material-ui/icons/Description'
import ImageIcon from '@material-ui/icons/Image'
import LoyaltyIcon from '@material-ui/icons/Loyalty'
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
} from '@material-ui/pickers'
import { isBefore, addHours } from 'date-fns'  // eslint-disable-line
import { fr } from 'date-fns/locale'  // eslint-disable-line
import { FormProvider, Controller } from 'react-hook-form'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Label, RowFields, SelectImage } from 'src/components/Form'

import {
  AutocompleteFormField,
  AutocompleteFormFieldKey,
  GoogleMapLocation,
} from 'src/components/GoogleMapLocation'
import { ImageWithFallback } from 'src/components/ImageWithFallback'
import { Modal } from 'src/components/Modal'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { DTOCreateEntourageAsEvent, DTOUpdateEntourageAsEvent } from 'src/core/api'
import { feedActions, selectEventImages, selectEventImagesFetching } from 'src/core/useCases/feed'
import { useCreateOrUpdateEntourage } from 'src/hooks/useCreateOrUpdateEntourage'
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
    uuid: string;
    title: string;
    imageUrl?: string;
  };
}

export function ModalEditEvent(props: ModalEditEventProps) {
  const { event: existingEvent } = props
  const dispatch = useDispatch()
  const { createEntourage, updateEntourage, hasBeenUpdated } = useCreateOrUpdateEntourage()

  const eventImages = useSelector(selectEventImages)
  const eventImagesFetching = useSelector(selectEventImagesFetching)

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

  const { register, trigger, getValues, setValue, control } = form

  const modalTexts = texts.content.modalEditEvent

  const defaultStartDate = existingEvent?.startDateISO
    ? new Date(existingEvent?.startDateISO)
    : new Date()

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

    const imageValuesToSend = {
      landscapeUrl: updatedImage?.landscapeUrl,
      landscapeThumbnailUrl: updatedImage?.landscapeSmallUrl,
      portraitUrl: updatedImage?.portraitUrl,
      portraitThumbnailUrl: updatedImage?.portraitSmallUrl,
    }

    if (existingEvent) {
      const locationMeta = autocompletePlace
        ? await getLocationFromPlace(autocompletePlace)
        : null

      const event: DTOUpdateEntourageAsEvent = {
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
        updateEntourage(existingEvent.uuid, event)
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

      const event: DTOCreateEntourageAsEvent = {
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
        public: true,
      }
      createEntourage(event)
    }

    return false
  }, [createEntourage, endDate, eventImages, existingEvent, getValues, startDate, trigger, updateEntourage])

  useEffect(() => {
    register({ name: AutocompleteFormFieldKey as FormFieldKey })
  }, [register])

  return (
    <Modal
      closeOnNextRender={hasBeenUpdated}
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
                TextFieldComponent={TextField}
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
                TextFieldComponent={TextField}
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
          <Controller
            control={control}
            defaultValue=""
            name={'imageId' as FormFieldKey}
            render={({ onChange, onBlur, name, value }) => {
              return (
                <SelectImage
                  fullWidth={true}
                  name={name}
                  onBlur={onBlur}
                  onChange={onChange}
                  options={eventImages.map((eventImage) => ({
                    image:
                    (
                      <Box alignItems="center" display="flex" height="100px" justifyContent="center" width="100%">
                        <ImageWithFallback
                          alt={eventImage.title}
                          fallback="/placeholder-event.jpeg"
                          src={eventImage.landscapeSmallUrl}
                          width={300}
                        />
                      </Box>
                    ),
                    value: eventImage.id,
                  }))}
                  startAdornment={(
                    <InputAdornment position="start">
                      <ImageIcon />
                    </InputAdornment>
                  )}
                  value={value}
                />
              )
            }}
            rules={{ required: false }}
          />
        </MuiPickersUtilsProvider>
        {
          eventImagesFetching && <OverlayLoader />
        }
      </FormProvider>
    </Modal>
  )
}
