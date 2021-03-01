import React from 'react'

interface Props {
  children: JSX.Element;
  size: number;
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
        borderRadius: '50%',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 1px 4px',
      }}
    >
      {children}
    </div>
  )
}
