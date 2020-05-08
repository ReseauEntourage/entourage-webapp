import React, { useState, createContext, useMemo, useContext } from 'react'

interface LayoutContextValue {
  drawerIsOpen: boolean;
  setDrawerIsOpen (value: LayoutContextValue['drawerIsOpen']): void;
}

const LayoutContext = createContext<LayoutContextValue>({} as LayoutContextValue)

export function useLayoutContext() {
  return useContext(LayoutContext)
}

interface ProviderProps {
  children: React.ReactChild;
}

export function LayoutProvider(props: ProviderProps) {
  const { children } = props
  const [drawerIsOpen, setDrawerIsOpen] = useState<LayoutContextValue['drawerIsOpen']>(false)

  const contextValue = useMemo(() => ({
    drawerIsOpen,
    setDrawerIsOpen,
  }), [drawerIsOpen])

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  )
}
