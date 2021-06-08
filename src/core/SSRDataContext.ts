import { createContext, useContext } from 'react'

interface ContextValue {
  userAgent: string;
}

export const SSRDataContext = createContext<ContextValue>({} as ContextValue)

export function useSSRDataContext() {
  return useContext(SSRDataContext)
}
