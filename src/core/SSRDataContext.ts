import { createContext, useContext } from 'react'
import { AnyToFix } from 'src/utils/types'

interface ContextValue {
  me?: AnyToFix;
}

export const SSRDataContext = createContext<ContextValue>({} as ContextValue)

export function useSSRDataContext() {
  return useContext(SSRDataContext)
}
