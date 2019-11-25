import React, {
  useState, createContext, useMemo, useContext,
} from 'react'
import { FeedItem } from 'src/api'

interface MainContextValue {
  feedItem: FeedItem | null;
  onChangeFeedItem: (value: MainContextValue['feedItem']) => void;
}

const MainContext = createContext<MainContextValue>({} as MainContextValue)

export function useMainContext() {
  return useContext(MainContext)
}

export function Provider(props: { children: React.ReactChild; }) {
  const [feedItem, onChangeFeedItem] = useState<MainContextValue['feedItem']>(null)

  const contextValue = useMemo(() => ({
    feedItem,
    onChangeFeedItem,
  }), [feedItem])

  const { children } = props
  return (
    <MainContext.Provider value={contextValue}>
      {children}
    </MainContext.Provider>
  )
}
