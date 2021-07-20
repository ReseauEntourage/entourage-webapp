import React, { ImgHTMLAttributes, useEffect, useState } from 'react'

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  fallback: string;
}

export function ImageWithFallback({ fallback, src, ...props }: Props) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  const onError = () => setImgSrc(fallback)

  const { alt, ...restProps } = props

  return <img alt={alt} onError={onError} src={imgSrc || fallback} {...restProps} />
}
