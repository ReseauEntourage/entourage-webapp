import React, { useCallback } from 'react'
import styled from 'styled-components'
import useForm from 'react-hook-form'
import { TextField, validators, useCatchUnreadFormErrors } from 'src/components/Form'
import { Modal } from 'src/components/Modal'
import { theme } from 'src/styles'
import { texts } from 'src/i18n'
import { useQueryMe, useMutateMe } from 'src/network/queries'

const Container = styled.div`
  width: 500px;
`

const Label = styled.div`
  margin-top: ${theme.spacing(2)}px;
`

const Names = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${theme.spacing(2)}px;
`

const formField = {
  firstName: 'firstName' as string,
  lastName: 'lastName' as string,
  about: 'about' as string,
  address: 'address' as string,
  email: 'email' as string,
}

export function ProfileModal() {
  const { data: me } = useQueryMe()
  const [mutateMe] = useMutateMe()

  const user = (me && me.data && me.data.user) || {}

  const { register, errors: plainErrors, triggerValidation, getValues } = useForm<typeof formField>({
    defaultValues: {
      // @ts-ignore
      firstName: user.firstName,
      // @ts-ignore
      lastName: user.lastName,
      // @ts-ignore
      about: user.about,
      // @ts-ignore
      email: user.email,
      // address: user.address,
    },
  })

  const errors = useCatchUnreadFormErrors(plainErrors)

  const modalTexts = texts.content.profilModal

  const onValidate = useCallback(async () => {
    if (!await triggerValidation()) {
      return false
    }

    const {
      firstName,
      lastName,
      about,
      // address,
      email,
    } = getValues()

    try {
      await mutateMe({
        firstName,
        lastName,
        about,
        // address,
        email,
      })
      return true
    } catch (e) {
      return false
    }
  }, [getValues, mutateMe, triggerValidation])

  return (
    <Modal
      title={modalTexts.modalTitle}
      validateLabel={texts.labels.save}
      onValidate={onValidate}
    >
      <Container>
        <Label>
          {modalTexts.step1}
        </Label>
        <Names>
          <TextField
            label={modalTexts.firstNameLabel}
            type="text"
            name={formField.firstName}
            fullWidth={true}
            inputRef={register({
              required: true,
            })}
            formError={errors.firstName}
          />
          <TextField
            label={modalTexts.lastNameLabel}
            type="text"
            name={formField.lastName}
            fullWidth={true}
            inputRef={register({
              required: true,
            })}
            formError={errors.lastName}
          />
        </Names>
        <Label>
          {modalTexts.step2}
        </Label>
        <TextField
          label={modalTexts.decriptionLabel}
          type="text"
          name={formField.about}
          multiline={true}
          fullWidth={true}
          inputRef={register({
            required: true,
          })}
          formError={errors.about}
        />
        <Label>
          {modalTexts.step3}
        </Label>
        {/* <GoogleMapLocation
          textFieldProps={{
            label: modalTexts.locationLabel,
            name: formField.address,
            inputRef: register({ required: true }),
            formError: errors.ss,
          }}
        /> */}
        <Label>
          {modalTexts.step4}
        </Label>
        <TextField
          label={modalTexts.emailLabel}
          type="email"
          name="email"
          fullWidth={true}
          inputRef={register({
            required: true,
            validate: {
              email: validators.email,
            },
          })}
          formError={errors.email}
        />
      </Container>
    </Modal>
  )
}
