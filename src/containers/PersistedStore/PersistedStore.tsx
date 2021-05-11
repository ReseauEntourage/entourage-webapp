import { PersistGate } from 'redux-persist/integration/react'
import { useStore } from 'react-redux'
import { SplashScreen } from 'src/components/SplashScreen'

export function PersistedStore(props: { children: React.ReactNode; }) {
  const { children } = props
  const store = useStore()

  return (
    // @ts-expect-error
    // eslint-disable-next-line
    <PersistGate loading={<SplashScreen />} persistor={store.__persistor}>
      {children}
    </PersistGate>
  )
}
