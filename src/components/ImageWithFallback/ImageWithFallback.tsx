import React, { ImgHTMLAttributes, useState } from 'react'

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  fallback: string;
}

export function ImageWithFallback({ fallback, src, ...props }: Props) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src)
  const onError = () => setImgSrc(fallback)

  const { alt, ...restProps } = props

  return <img alt={alt} onError={onError} src={imgSrc || fallback} {...restProps} />
}
