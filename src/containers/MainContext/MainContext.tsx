import React, { useState, createContext, useMemo, useContext } from 'react'
import { FeedItem, schema } from 'src/api'

interface MainContextValue {
  feedItem: FeedItem | null;
  onChangeFeedItem: (value: MainContextValue['feedItem']) => void;
  me: typeof schema['GET users/me']['response']['user'] | null;
  setMe: (value: MainContextValue['me']) => void;
}

const MainContext = createContext<MainContextValue>({} as MainContextValue)

export function useMainContext() {
  return useContext(MainContext)
}

export function Provider(props: { children: React.ReactChild; }) {
  const [feedItem, onChangeFeedItem] = useState<MainContextValue['feedItem']>(null)
  const [me, setMe] = useState<MainContextValue['me']>(null)

  const contextValue = useMemo(() => ({
    feedItem,
    onChangeFeedItem,
    me,
    setMe,
  }), [feedItem, me])

  const { children } = props
  return (
    <MainContext.Provider value={contextValue}>
      {children}
    </MainContext.Provider>
  )
}
