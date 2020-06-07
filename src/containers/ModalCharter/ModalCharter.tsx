import LockIcon from '@material-ui/icons/Lock'
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver'
import RoomIcon from '@material-ui/icons/Room'
import React from 'react'
import { Button } from 'src/components/Button'
import { Modal } from 'src/components/Modal'
import { constants } from 'src/constants'
import { texts } from 'src/i18n'
import * as S from './ModalCharter.styles'

interface ModalCharterProps {
  onValidate: () => void;
}

export function ModalCharter(props: ModalCharterProps) {
  const { onValidate } = props
  const modalTexts = texts.content.modalCharter
  const iconStyle = {
    fontSize: 30,
  }

  return (
    <Modal
      onValidate={onValidate}
      title={modalTexts.title}
      validateLabel={modalTexts.validateLabel}
    >
      <S.CharteItem>
        <S.CharItemIcon>
          <RecordVoiceOverIcon style={iconStyle} />
        </S.CharItemIcon>
        <S.CharItemTitle>{modalTexts.step1.title}</S.CharItemTitle>
        <S.CharItemContent>{modalTexts.step1.content}</S.CharItemContent>
      </S.CharteItem>
      <S.CharteItem>
        <S.CharItemIcon>
          <LockIcon style={iconStyle} />
        </S.CharItemIcon>
        <S.CharItemTitle>{modalTexts.step2.title}</S.CharItemTitle>
        <S.CharItemContent>{modalTexts.step2.content}</S.CharItemContent>
      </S.CharteItem>
      <S.CharteItem>
        <S.CharItemIcon>
          <RoomIcon style={iconStyle} />
        </S.CharItemIcon>
        <S.CharItemTitle>{modalTexts.step3.title}</S.CharItemTitle>
        <S.CharItemContent>{modalTexts.step3.content}</S.CharItemContent>
      </S.CharteItem>
      <S.CharterLinkContainer>
        <Button href={constants.CHARTER_LINK} target="_blank">
          Lire la charte complète
        </Button>
      </S.CharterLinkContainer>
    </Modal>
  )
}
