import React from 'react'

interface Props {
  size: number;
  children: JSX.Element;
}

export function BaseMarker(props: Props) {
  const { size, children } = props
  return (
    <div
      style={{
        display: 'block',
        marginLeft: -(size / 2),
        marginTop: -(size / 2),
        height: size,
        width: size,
      }}
    >
      {children}
    </div>
  )
}
