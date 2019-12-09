import React from 'react'
import { Modal } from 'src/components/Modal'
import { texts } from 'src/i18n'

interface ModalCharteProps {
  onValidate: () => void;
}

export function ModalCharte(props: ModalCharteProps) {
  const { onValidate } = props

  return (
    <Modal
      onValidate={onValidate}
      title={texts.content.modalCharte.title}
      validateLabel={texts.content.modalCharte.validateLabel}
    >
      Charte...
    </Modal>
  )
}
