import React from 'react'
import { Modal } from 'src/components/Modal'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { PartnerCard } from 'src/components/PartnerCard'
import { assertIsDefined } from 'src/utils/misc'

interface ModalParnerCardProps {
  partner: React.ComponentProps<typeof PartnerCard>;
}

export function ModalPartnerCard(props: ModalParnerCardProps) {
  const { partner } = props

  if (!partner) {
    return (
      <Modal cancel={false} title="" validate={false}>
        <OverlayLoader />
      </Modal>
    )
  }

  assertIsDefined(partner)

  return (
    <Modal
      cancel={false}
      showCloseButton={true}
      title={partner.name}
      validate={false}
    >
      <PartnerCard
        {...partner}
      />
    </Modal>
  )
}
