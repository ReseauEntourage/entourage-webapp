import React, { useState, useMemo } from 'react'
import { ModalContext } from './ModalContext'

interface Props {
  modal: React.ReactElement;
  children: React.ReactElement;
}

export function ModalTrigger(props: Props) {
  const { modal, children } = props
  const [isOpen, setIsOpen] = useState(false)

  const contextValue = useMemo(() => ({
    onClose: () => setIsOpen(false),
  }), [])

  return (
    <ModalContext.Provider value={contextValue}>
      {React.cloneElement(children, {
        onClick: () => setIsOpen(true),
      })}
      {isOpen ? modal : null}
    </ModalContext.Provider>
  )
}
