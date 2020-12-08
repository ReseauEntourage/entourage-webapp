import { Subject } from 'rxjs'
import React, { useState, useEffect, useMemo } from 'react'
import uniqid from 'uniqid'
import { ModalContext } from './ModalContext'

const modalsSubject = new Subject()

export function openModal(modal: React.ReactNode) {
  modalsSubject.next(modal)
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
          const modalContextValue = {
            onClose: () => setModals((prevModals) => ({
              ...prevModals,
              [key]: null,
            })),
          }

          return (
            <ModalContext.Provider key={key} value={modalContextValue}>
              {modal}
            </ModalContext.Provider>
          )
        })}
    </>
  )
}
