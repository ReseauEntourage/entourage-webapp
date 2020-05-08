import React, { useState, createContext, useMemo, useContext } from 'react'
import { UseQueryFeedItem } from 'src/core/store'

interface MainStoreContextValue {
  feedItem: UseQueryFeedItem | null;
  onChangeFeedItem: (value: MainStoreContextValue['feedItem']) => void;
}

const MainStoreContext = createContext<MainStoreContextValue>({} as MainStoreContextValue)

export function useMainStore() {
  return useContext(MainStoreContext)
}

interface ProviderProps {
  children: React.ReactChild;
}

export function MainStoreProvider(props: ProviderProps) {
  const { children } = props
  const [feedItem, onChangeFeedItem] = useState<MainStoreContextValue['feedItem']>(null)

  const contextValue = useMemo(() => ({
    feedItem,
    onChangeFeedItem,
  }), [feedItem])

  return (
    <MainStoreContext.Provider value={contextValue}>
      {children}
    </MainStoreContext.Provider>
  )
}
