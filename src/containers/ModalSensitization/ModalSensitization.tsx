import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { TextField } from 'src/components/Form'
import { Modal } from 'src/components/Modal'
import { texts } from 'src/i18n'
import { useIsDesktop, variants } from 'src/styles'
import * as S from './ModalSensitization.styles'
import { ModalSensitizationActions } from './ModalSensitizationActions'

export function ModalSensitization() {
  const isDesktop = useIsDesktop()
  const { register, getValues, trigger, errors } = useForm()
  const [hasDismissed, setHasDismissed] = useState(false)

  const modalTexts = texts.content.modalSensitization

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
          <TextField
            autoFocus={true}
            formErrors={errors}
            fullWidth={true}
            inputRef={register({ required: true, min: 1 })}
            label={modalTexts.reason}
            margin="dense"
            name="dismissReason"
          />
        )
      }
    </Modal>
  )
}
