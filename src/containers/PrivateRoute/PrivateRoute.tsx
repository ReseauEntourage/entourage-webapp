import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectIsLogged, selectIsLogging } from 'src/core/useCases/authUser'

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute(props: PrivateRouteProps) {
  const { children } = props
  const router = useRouter()
  const iAmLogged = useSelector(selectIsLogged)
  const iAmLogging = useSelector(selectIsLogging)

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
