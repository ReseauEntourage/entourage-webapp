import { Subject } from 'rxjs'
import React, { useState, useEffect, useMemo } from 'react'
import uniqid from 'uniqid'
import { ModalContext } from './ModalContext'

const modalsSubject = new Subject()

export function openModal(modal: React.ReactNode) {
  modalsSubject.next(modal)
}

interface ModalContextProviderProps {
  modal: React.ReactNode;
  modalKey: string;
  setModals(fn: (value: Record<string, React.ReactNode>) => Record<string, React.ReactNode>): void;
}

function ModalContextProvider(props: ModalContextProviderProps) {
  const { modal, setModals, modalKey } = props

  const modalContextValue = useMemo(() => ({
    onClose: () => setModals((prevModals) => ({
      ...prevModals,
      [modalKey]: null,
    })),
  }), [setModals, modalKey])

  return (
    <ModalContext.Provider value={modalContextValue}>
      {modal}
    </ModalContext.Provider>
  )
}

export function ModalsListener() {
  const [modals, setModals] = useState<{ [key in string]: React.ReactNode; }>({})

  const subscription = useMemo(() => {
    // @ts-ignore
    return modalsSubject.subscribe((modal: React.ReactNode) => {
      const modalKey = uniqid()
      setModals((prevModals) => ({
        ...prevModals,
        [modalKey]: modal,
      }))
    })
  }, [])

  useEffect(() => {
    return () => subscription.unsubscribe()
  }, [subscription])

  return (
    <>
      {Object.entries(modals)
        .filter(([, value]) => value)
        .map(([key, modal]) => {
          return (
            <ModalContextProvider
              key={key}
              modal={modal}
              modalKey={key}
              setModals={setModals}
            />
          )
        })}
    </>
  )
}
