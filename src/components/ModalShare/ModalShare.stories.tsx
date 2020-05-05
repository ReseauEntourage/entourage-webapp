import React from 'react'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { ModalShare } from './ModalShare'

export default {
  title: 'ModalShare',
  parameters: {
    component: ModalShare,
  },
}

export const Demo = () => (
  <TransparentWrapper>
    <ModalShare
      content="Content"
      entourageUuid="entourageUUID"
      title="Title"
    />
  </TransparentWrapper>
)
