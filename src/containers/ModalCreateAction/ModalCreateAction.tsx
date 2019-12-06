import React, { useCallback } from 'react'
import { FormContext } from 'react-hook-form'
import { Modal } from 'src/components/Modal'
import { texts } from 'src/i18n'
import { TextField, Label, RowFields, useForm } from 'src/components/Form'

interface FormField {
  address: {
    latitude: number;
    longitude: number;
  };
  category: string;
  description: string;
  title: string;
}

type FormFieldKey = keyof FormField

export function ModalCreateAction() {
  const form = useForm<FormField>()
  const { register, triggerValidation } = form
  const modalTexts = texts.content.modalCreateAction

  const onValidate = useCallback(async () => {
    if (!await triggerValidation()) return false

    return true
  }, [triggerValidation])

  return (
    <Modal
      onValidate={onValidate}
      title={modalTexts.title}
      validateLabel={modalTexts.validateLabel}
    >
      <FormContext {...form}>
        <Label>{modalTexts.step1}</Label>
        <RowFields>
          <TextField
            fullWidth={true}
            inputRef={register({
              required: true,
            })}
            label={modalTexts.fieldLabelCategory}
            name={'category' as FormFieldKey}
            type="text"
          />
          <TextField
            fullWidth={true}
            inputRef={register({
              required: true,
            })}
            label={modalTexts.fieldLabelAddress}
            name={'address' as FormFieldKey}
            type="text"
          />
        </RowFields>
        <Label>{modalTexts.step2}</Label>
        <TextField
          fullWidth={true}
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
          inputRef={register({
            required: true,
          })}
          label={modalTexts.fieldLabelDescription}
          name={'description' as FormFieldKey}
          type="text"
        />
      </FormContext>
    </Modal>
  )
}
