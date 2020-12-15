import { createContext, useContext } from 'react'

interface ModalContextValue {
  onClose: () => void;
}

export const ModalContext = createContext<ModalContextValue>({} as ModalContextValue)

export function useModalContext() {
  const modalContext = useContext(ModalContext)

  if (!modalContext) {
    throw new Error('You can\'t use useModalContext() outside modal')
  }

  return modalContext
}
