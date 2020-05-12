import InputAdornment from '@material-ui/core/InputAdornment'
import DescriptionIcon from '@material-ui/icons/Description'
import ListIcon from '@material-ui/icons/List'
import LoyaltyIcon from '@material-ui/icons/Loyalty'
import { FormContext } from 'react-hook-form'
import React, { useCallback, useEffect } from 'react'
import { TextField, Label, RowFields, useForm, Select } from 'src/components/Form'
import { GoogleMapLocation, GoogleMapLocationValue } from 'src/components/GoogleMapLocation'
import { Modal } from 'src/components/Modal'
import { FeedDisplayCategory, FeedEntourageType } from 'src/core/api'
import { useMutateCreateEntourages, useMutateUpdateEntourages } from 'src/core/store'
import { texts } from 'src/i18n'
import { getDetailPlacesService, assertIsNumber } from 'src/utils/misc'

const categories: FeedDisplayCategory[] = ['info', 'mat_help', 'other', 'resource', 'skill', 'social']

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
  autocompletePlace: GoogleMapLocationValue;
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
    displayCategory: string;
    entourageType: string;
    id: number;
    title: string;
  };
}

export function ModalEditAction(props: ModalEditActionProps) {
  const { action: existedAction } = props

  const isCreation = !existedAction

  const defaultValues = {
    category: existedAction ? `${existedAction.entourageType}:${existedAction.displayCategory}` : '',
    description: existedAction?.description,
    title: existedAction?.title,
  }

  const form = useForm<FormField>({ defaultValues })
  const { register, triggerValidation, getValues, setValue } = form
  const modalTexts = texts.content.modalEditAction

  const [createEntourage] = useMutateCreateEntourages()
  const [updateEntourage] = useMutateUpdateEntourages()

  const onValidate = useCallback(async () => {
    if (!await triggerValidation()) return false

    const {
      category: plainCategory,
      autocompletePlace,
      title,
      description,
    } = getValues()

    const { displayCategory, entourageType } = parseCategoryValue(plainCategory)

    if (existedAction) {
      const action = {
        id: existedAction.id,
        title,
        description,
        displayCategory,
        entourageType,
      }

      try {
        await updateEntourage(action)
      } catch (error) {
        return false
      }
    } else {
      const placeDetail = await getDetailPlacesService(
        autocompletePlace.place.place_id,
        autocompletePlace.googleSessionToken,
      )

      const latitude = placeDetail.geometry?.location.lat()
      const longitude = placeDetail.geometry?.location.lng()

      assertIsNumber(latitude)
      assertIsNumber(longitude)

      const action = {
        title,
        description,
        displayCategory,
        entourageType,
        location: {
          latitude,
          longitude,
        },
      }

      try {
        await createEntourage(action)
      } catch (error) {
        return false
      }
    }

    return true
  }, [createEntourage, existedAction, getValues, triggerValidation, updateEntourage])

  useEffect(() => {
    register({ name: 'autocompletePlace' as FormFieldKey })
  }, [register])

  const options: Options = [
    {
      label: modalTexts.fieldCategoryHelpLabel,
      options: categories.map((category) => ({
        label: modalTexts.fieldCategoryHelpList[category],
        value: createCategoryValue('ask_for_help', category),
      })),
    },
    {
      label: modalTexts.fieldCategoryContributionLabel,
      options: categories.map((category) => ({
        label: modalTexts.fieldCategoryContributionList[category],
        value: createCategoryValue('contribution', category),
      })),
    },
  ]

  return (
    <Modal
      onValidate={onValidate}
      title={modalTexts.title}
      validateLabel={isCreation ? modalTexts.validateLabelCreate : modalTexts.validateLabelUpdate}
    >
      <FormContext {...form}>
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
          {isCreation && (
            <GoogleMapLocation
              includeLatLng={true}
              onChange={(autocompletePlace) => setValue('autocompletePlace' as FormFieldKey, autocompletePlace)}
              textFieldProps={{
                label: modalTexts.fieldLabelAddress,
                name: 'action-address',
                inputRef: register({ required: true }),
              }}
            />
          )}
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
          label={modalTexts.fieldLabelTitle}
          name={'title' as FormFieldKey}
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
          label={modalTexts.fieldLabelDescription}
          multiline={true}
          name={'description' as FormFieldKey}
          rows="4"
          type="text"
        />
      </FormContext>
    </Modal>
  )
}
