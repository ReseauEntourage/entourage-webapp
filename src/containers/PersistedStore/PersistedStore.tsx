import { PersistGate } from 'redux-persist/integration/react'
import React from 'react'
import { useStore } from 'react-redux'
import { SplashScreen } from 'src/components/SplashScreen'
import { isSSR } from 'src/utils/misc'

export function PersistedStore(props: { children: React.ReactNode; }) {
  const { children } = props
  const store = useStore()

  if (isSSR) {
    // TODO fix 'Expected server HTML to contain a matching <img> in <div>'.
    return <>{children}</>
  }

  return (
    // @ts-expect-error
    // eslint-disable-next-line
    <PersistGate loading={<SplashScreen />} persistor={store.__persistor}>
      {children}
    </PersistGate>
  )
}
