import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useQueryIAmLogged } from 'src/core/store'

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute(props: PrivateRouteProps) {
  const { children } = props
  const router = useRouter()
  const { iAmLogged, iAmLogging } = useQueryIAmLogged()

  useEffect(() => {
    const shouldRedirect = !iAmLogged && !iAmLogging

    if (shouldRedirect) {
      router.push('/')
    }
  }, [iAmLogged, iAmLogging, router])

  if (!iAmLogged) {
    return null
  }

  return (
    <>
      {children}
    </>
  )
}
