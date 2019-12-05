import React, { useState, useCallback, useRef } from 'react'
import Box from '@material-ui/core/Box'
import { Button } from 'src/components/Button'
import ReactCrop, { ReactCropProps } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { texts } from 'src/i18n'

const defaultCrop: ReactCropProps['crop'] = {
  unit: '%',
  width: 100,
  height: 100,
  aspect: 1,
}

export interface ImageCropperValue {
  blob: Blob;
  src: string;
}

export interface ImageCropperProps {
  onChange?: (value: ImageCropperValue) => void;
  onValidate?: (value: ImageCropperValue) => void;
}

export function ImageCropper(props: ImageCropperProps) {
  const { onChange, onValidate } = props
  const [editing, setEditing] = useState(false)
  const [src, setSrc] = useState()
  const [value, setValue] = useState()
  const [crop, setCrop] = useState(defaultCrop)
  const imageRef = useRef()
  const fileUrl = useRef<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const onImageLoaded = useCallback((image) => {
    imageRef.current = image
  }, [])

  const getCroppedImg = useCallback((image, cropParams, fileName): Promise<ImageCropperValue> => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = cropParams.width
    canvas.height = cropParams.height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Canvas context not found')
    }

    ctx.drawImage(
      image,
      cropParams.x * scaleX,
      cropParams.y * scaleY,
      cropParams.width * scaleX,
      cropParams.height * scaleY,
      0,
      0,
      cropParams.width,
      cropParams.height,
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          // reject(new Error('Canvas is empty'));
          console.error('Canvas is empty')
          return
        }

        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        blob.name = fileName
        window.URL.revokeObjectURL(fileUrl.current)
        fileUrl.current = window.URL.createObjectURL(blob)
        resolve({
          src: fileUrl.current,
          blob,
        })
      }, 'image/jpeg')
    })
  }, [])

  const makeClientCrop = useCallback(async (cropParams) => {
    if (imageRef.current && cropParams.width && cropParams.height) {
      const internalValue = await getCroppedImg(
        imageRef.current,
        crop,
        'newFile.jpeg',
      )

      setValue(internalValue)

      if (onChange) {
        onChange(value)
      }
    }
  }, [crop, getCroppedImg, onChange, value])

  const onCropComplete = useCallback((cropParams) => {
    makeClientCrop(cropParams)
  }, [makeClientCrop])

  const onCropChange = useCallback((nextCrop) => {
    setCrop(nextCrop)
  }, [])

  const onSelectFile = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      setEditing(true)
      const reader = new FileReader()
      reader.addEventListener('load', () => setSrc(reader.result))
      reader.readAsDataURL(e.target.files[0])
    }
  }, [])

  const internalOnValidate = useCallback(() => {
    if (onValidate) {
      onValidate(src)
    }

    setEditing(false)
  }, [onValidate, src])

  return (
    <div
      style={{
        // inWidth: 300,
        // minHeight: 300,
        width: 'fit-content', // TODO: not compatible with all browsers
      }}
    >
      <input
        ref={inputRef}
        accept="image/*"
        onChange={onSelectFile}
        style={{
          display: 'none',
        }}
        type="file"
      />
      {editing && (
        <ReactCrop
          circularCrop={true}
          crop={crop}
          onChange={onCropChange}
          onComplete={onCropComplete}
          onImageLoaded={onImageLoaded}
          ruleOfThirds={true}
          src={src}
        />
      )}
      <Box
        display="flex"
        justifyContent="space-around"
        margin={2}
      >
        <Button onClick={() => inputRef.current && inputRef.current.click()}>
          {src ? texts.labels.changeImage : texts.labels.chooseImage}
        </Button>
        {src && (
          <Button onClick={internalOnValidate}>{texts.labels.validate}</Button>
        )}
      </Box>
      {!editing && value && (
        <div>
          <img alt="Copper preview" src={value.src} />
        </div>
      )}
    </div>
  )
}
