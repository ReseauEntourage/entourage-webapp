import { Subject } from 'rxjs'
import React, { useState, useEffect } from 'react'
import uniqid from 'uniqid'
import { ModalContext } from './ModalContext'

const modalsSubject = new Subject()

export function openModal(modal: React.ReactNode) {
  modalsSubject.next(modal)
}

export function ModalsListener() {
  const [modals, setModals] = useState<{ [key in symbol]: React.ReactNode; }>({})

  useEffect(() => {
    const subscription = modalsSubject.subscribe((modal) => {
      setModals((prevModals) => ({
        ...prevModals,
        [uniqid()]: modal,
      }))
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

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
              {/* strange things */}
              {modal}
            </ModalContext.Provider>
          )
        })}
    </>
  )
}
