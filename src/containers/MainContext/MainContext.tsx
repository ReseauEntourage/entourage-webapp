import React, { useState, createContext, useMemo, useContext } from 'react'
import { FeedItem, User } from 'src/api'

interface MainContextValue {
  feedItem: FeedItem | null;
  onChangeFeedItem: (value: MainContextValue['feedItem']) => void;
  me: User;
  setMe: (value: MainContextValue['me']) => void;
}

const MainContext = createContext<MainContextValue>({} as MainContextValue)

export function useMainContext() {
  return useContext(MainContext)
}

interface ProviderProps {
  children: React.ReactChild;
  me: MainContextValue['me'];
}

export function Provider(props: ProviderProps) {
  const { me: meProp, children } = props
  const [feedItem, onChangeFeedItem] = useState<MainContextValue['feedItem']>(null)
  const [me, setMe] = useState<MainContextValue['me']>(meProp)

  const contextValue = useMemo(() => ({
    feedItem,
    onChangeFeedItem,
    me,
    setMe,
  }), [feedItem, me])

  return (
    <MainContext.Provider value={contextValue}>
      {children}
    </MainContext.Provider>
  )
}
