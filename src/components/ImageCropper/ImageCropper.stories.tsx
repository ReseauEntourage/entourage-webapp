import React, { useState } from 'react'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { ImageCropper as ImageCropperBase, ImageCropperValue } from './ImageCropper'

export default {
  title: 'ImageCropper',
}

export const Base = () => (
  <TransparentWrapper>
    <ImageCropperBase onChange={() => null} />
  </TransparentWrapper>
)

export const Preview = () => {
  const [value, setValue] = useState<ImageCropperValue>()

  return (
    <TransparentWrapper>
      <ImageCropperBase onChange={setValue} />
      {value?.src && (
        <img alt="Copper demo" src={value.src} />
      )}
    </TransparentWrapper>
  )
}
