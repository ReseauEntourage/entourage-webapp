import React, { useState, createContext, useMemo, useContext } from 'react'
import { FeedItem } from 'src/core/api'

interface MainContextValue {
  feedItem: FeedItem | null;
  onChangeFeedItem: (value: MainContextValue['feedItem']) => void;
}

const MainContext = createContext<MainContextValue>({} as MainContextValue)

export function useMainContext() {
  return useContext(MainContext)
}

interface ProviderProps {
  children: React.ReactChild;
}

export function Provider(props: ProviderProps) {
  const { children } = props
  const [feedItem, onChangeFeedItem] = useState<MainContextValue['feedItem']>(null)

  const contextValue = useMemo(() => ({
    feedItem,
    onChangeFeedItem,
  }), [feedItem])

  return (
    <MainContext.Provider value={contextValue}>
      {children}
    </MainContext.Provider>
  )
}
