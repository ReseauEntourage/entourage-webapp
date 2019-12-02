import { createContext, useContext } from 'react'

interface ModalContextValue {
  onClose: () => void;
}

export const ModalContext = createContext<ModalContextValue | null>(null)

export function useModalContext() {
  return useContext(ModalContext)
}
