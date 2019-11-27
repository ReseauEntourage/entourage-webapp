import React, { useState, createContext, useMemo, useContext } from 'react'

interface ModalTriggerContextValue {
  open: boolean;
  onClose: () => void;
}

const ModalTriggerContext = createContext<ModalTriggerContextValue>({} as ModalTriggerContextValue)

export function useModalTriggerContext() {
  return useContext(ModalTriggerContext)
}

interface Props {
  modal: React.ReactElement;
  children: React.ReactElement;
  loadBeforeOpen?: boolean;
}

export function ModalTrigger(props: Props) {
  const { modal, children, loadBeforeOpen } = props
  const [isOpen, setIsOpen] = useState(false)

  const contextValue = useMemo(() => ({
    open: isOpen,
    onClose: () => setIsOpen(false),
  }), [isOpen])

  return (
    <ModalTriggerContext.Provider value={contextValue}>
      {React.cloneElement(children, {
        onClick: () => setIsOpen(true),
      })}
      {(loadBeforeOpen || isOpen) ? modal : null}
    </ModalTriggerContext.Provider>
  )
}
