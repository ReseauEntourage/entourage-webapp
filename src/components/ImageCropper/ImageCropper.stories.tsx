import React, { useState } from 'react'
import { ThemeProvider } from 'src/styles'
import { ImageCropper as ImageCropperBase, ImageCropperValue } from './ImageCropper'

export default {
  title: 'ImageCropper',
}

export const Base = () => (
  <ThemeProvider>
    <ImageCropperBase onChange={() => {}} />
  </ThemeProvider>
)

export const Preview = () => {
  const [value, setValue] = useState<ImageCropperValue>()

  return (
    <ThemeProvider>
      <div>
        <ImageCropperBase onChange={setValue} />
        {value?.src && (
          <img alt="Copper demo" src={value.src} />
        )}
      </div>
    </ThemeProvider>
  )
}
