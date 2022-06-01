import InputAdornment from '@material-ui/core/InputAdornment'
import DescriptionIcon from '@material-ui/icons/Description'
import ListIcon from '@material-ui/icons/List'
import LoyaltyIcon from '@material-ui/icons/Loyalty'
import React, { useCallback, useEffect } from 'react'
import { FormProvider } from 'react-hook-form'
import { Label, RowFields, Select, TextField } from 'src/components/Form'
import { AutocompleteFormField, AutocompleteFormFieldKey, GoogleMapLocation } from 'src/components/GoogleMapLocation'
import { Modal } from 'src/components/Modal'
import {
  DTOCreateEntourageAsAction,
  DTOUpdateEntourageAsAction,
  FeedDisplayCategory,
  FeedEntourageType,
} from 'src/core/api'
import { useCreateOrUpdateEntourage } from 'src/hooks/useCreateOrUpdateEntourage'
import { texts } from 'src/i18n'
import { useGetCurrentPosition } from 'src/utils/hooks'
import { getLocationFromPlace } from 'src/utils/misc'

const categories: FeedDisplayCategory[] = ['social', 'mat_help', 'resource', 'other'/* , 'info', 'skill' */]

function createCategoryValue(entourageType: FeedEntourageType, displayCategory: FeedDisplayCategory) {
  return `${entourageType}:${displayCategory}`
}

function parseCategoryValue(value: string) {
  const [entourageType, displayCategory] = value.split(':') as [FeedEntourageType, FeedDisplayCategory]

  return {
    entourageType,
    displayCategory,
  }
}

interface FormField {
  [AutocompleteFormFieldKey]: AutocompleteFormField;
  category: string;
  description: string;
  title: string;
}

type FormFieldKey = keyof FormField

type Options = {
  label: string;
  options: {
    label: string;
    value: string;
  }[];
}[]

interface ModalEditActionProps {
  action?: {
    description: string;
    displayAddress: string;
    displayCategory: string;
    entourageType: string;
    uuid: string;
    title: string;
  };
}

export function ModalEditAction(props: ModalEditActionProps) {
  const { action: existingAction } = props

  const { createEntourage, updateEntourage, hasBeenUpdated } = useCreateOrUpdateEntourage()
  const isCreation = !existingAction

  const defaultValues = {
    category: existingAction ? `${existingAction.entourageType}:${existingAction.displayCategory}` : '',
    description: existingAction?.description,
    title: existingAction?.title,
  }

  const {
    displayAddress,
    setDisplayAddress,
    getCurrentLocation,
    form,
  } = useGetCurrentPosition<FormField>(defaultValues as FormField, existingAction?.displayAddress ?? '')

  const { register, trigger, getValues, setValue } = form
  const modalTexts = texts.content.modalEditAction
  const typesTexts = texts.types

  const onValidate = useCallback(async () => {
    if (!await trigger()) return false

    const {
      category: plainCategory,
      autocompletePlace,
      title,
      description,
    } = getValues()

    const { displayCategory, entourageType } = parseCategoryValue(plainCategory)

    if (existingAction) {
      const locationMeta = autocompletePlace
        ? await getLocationFromPlace(autocompletePlace)
        : undefined

      const action: DTOUpdateEntourageAsAction = {
        title,
        description,
        displayCategory,
        entourageType,
        location: locationMeta?.location,
      }

      try {
        await updateEntourage(existingAction.uuid, action)
      } catch (error) {
        return false
      }
    } else {
      const locationMeta = await getLocationFromPlace(autocompletePlace)

      const action: DTOCreateEntourageAsAction = {
        title,
        description,
        displayCategory,
        entourageType,
        location: locationMeta?.location,
        public: true,
      }
      createEntourage(action)
    }
    return false
  }, [existingAction, getValues, updateEntourage, trigger, createEntourage])

  useEffect(() => {
    register({ name: AutocompleteFormFieldKey as FormFieldKey })
  }, [register])

  const options: Options = [
    {
      label: modalTexts.fieldCategoryHelpLabel,
      options: categories.map((category) => ({
        label: typesTexts.categoryHelpList[category],
        value: createCategoryValue('ask_for_help', category),
      })),
    },
    {
      label: modalTexts.fieldCategoryContributionLabel,
      options: categories.map((category) => ({
        label: typesTexts.categoryContributionList[category],
        value: createCategoryValue('contribution', category),
      })),
    },
  ]

  return (
    <Modal
      closeOnNextRender={hasBeenUpdated}
      onValidate={onValidate}
      title={isCreation ? modalTexts.titleCreate : modalTexts.titleUpdate}
      validateLabel={isCreation ? modalTexts.validateLabelCreate : modalTexts.validateLabelUpdate}
    >
      <FormProvider {...form}>
        <Label>{modalTexts.step1}</Label>
        <RowFields>
          <Select
            inputRef={register({ required: true })}
            label={modalTexts.fieldLabelCategory}
            name={'category' as FormFieldKey}
            options={options}
            startAdornment={(
              <InputAdornment position="start">
                <ListIcon />
              </InputAdornment>
            )}
          />
          <GoogleMapLocation
            inputValue={displayAddress}
            onChange={(autocompletePlace) => {
              setDisplayAddress(autocompletePlace.place.description)
              setValue(AutocompleteFormFieldKey as FormFieldKey, autocompletePlace)
            }}
            onClickCurrentPosition={getCurrentLocation}
            textFieldProps={{
              name: 'action-address',
              inputRef: register({ required: isCreation }),
              placeholder: modalTexts.fieldLabelAddress,
            }}
          />
        </RowFields>
        <Label>{modalTexts.step2}</Label>
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
          name={'title' as FormFieldKey}
          placeholder={modalTexts.fieldLabelTitle}
          type="text"

        />
        <Label>{modalTexts.step3}</Label>
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
          placeholder={modalTexts.fieldLabelDescription}
          rows="4"
          type="text"
        />
      </FormProvider>
    </Modal>
  )
}
