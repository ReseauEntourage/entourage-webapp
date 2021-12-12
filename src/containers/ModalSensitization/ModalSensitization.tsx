import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Select } from 'src/components/Form'
import { Modal } from 'src/components/Modal'
import { texts } from 'src/i18n'
import { useIsDesktop, variants } from 'src/styles'
import { FirebaseEvent } from 'src/utils/types'
import * as S from './ModalSensitization.styles'
import { ModalSensitizationActions } from './ModalSensitizationActions'

type Options = {
  label: string;
  value: FirebaseEvent;
}[]

export function ModalSensitization() {
  const isDesktop = useIsDesktop()
  const { register, getValues, trigger, errors } = useForm()
  const [hasDismissed, setHasDismissed] = useState(false)

  const modalTexts = texts.content.modalSensitization

  const optionsList: Options = [
    {
      label: modalTexts.dismissReasons.alreadyParticipated,
      value: 'Action__Workshop__DismissAlready',
    },
    {
      label: modalTexts.dismissReasons.notInterested,
      value: 'Action__Workshop__DismissNotInterested',
    },
    {
      label: modalTexts.dismissReasons.wantToDiscover,
      value: 'Action__Workshop__DismissDiscover',
    },
  ]

  return (
    <Modal
      actions={(
        <ModalSensitizationActions
          errors={errors}
          getValues={getValues}
          hasDismissed={hasDismissed}
          setHasDismissed={setHasDismissed}
          trigger={trigger}
        />
      )}
      cancel={false}
      showCloseButton={false}
      title={modalTexts.title}
      validate={false}
    >
      <S.ModalContainer>
        <Box marginBottom={4}>
          <Typography align="center" variant={variants.title2}>
            {modalTexts.content}
          </Typography>
        </Box>

        <S.ContentContainer>
          {isDesktop && (
            <S.ImageContainer>
              <img
                alt="Personnage"
                src="/personnage-guide-1.png"
                width="150"
              />
            </S.ImageContainer>
          )}
          <S.QuoteContainer>
            <Typography align="left" variant={variants.bodyRegular}>
              &ldquo;{modalTexts.quote.content}&rdquo;
            </Typography>
            <Typography align="right" variant={variants.footNote}>
              - {modalTexts.quote.author}
            </Typography>
          </S.QuoteContainer>
        </S.ContentContainer>
      </S.ModalContainer>
      {
        hasDismissed && (
          <Select
            formErrors={errors}
            fullWidth={true}
            inputRef={register({ required: true, min: 1 })}
            label={modalTexts.reason}
            margin="dense"
            name="dismissReason"
            options={optionsList}
          />
        )
      }
    </Modal>
  )
}
