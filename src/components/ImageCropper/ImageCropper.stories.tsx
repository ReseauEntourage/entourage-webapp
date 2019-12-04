import React, { useState } from 'react'
import { ThemeProvider } from 'src/styles'
import { ImageCropper as ImageCropperBase } from './ImageCropper'

export default {
  title: 'ImageCropper',
}

export const Base = () => (
  <ThemeProvider>
    <ImageCropperBase onChange={() => {}} />
  </ThemeProvider>
)

export const Preview = () => {
  const [src, setSrc] = useState('')

  return (
    <ThemeProvider>
      <div>
        <ImageCropperBase onChange={setSrc} />
        {src && (
          <img alt="Copper demo" src={src} />
        )}
      </div>
    </ThemeProvider>
  )
}
