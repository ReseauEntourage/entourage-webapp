import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectIsLogged, selectIsLogging } from 'src/core/useCases/authUser'

interface PrivateRouteProps {
  children: JSX.Element;
}

export function PrivateRoute(props: PrivateRouteProps) {
  const { children } = props
  const router = useRouter()
  const iAmLogged = useSelector(selectIsLogged)
  const iAmLogging = useSelector(selectIsLogging)

  useEffect(() => {
    const shouldRedirect = !iAmLogged && !iAmLogging

    if (shouldRedirect) {
      router.push('/actions')
    }
  }, [iAmLogged, iAmLogging, router])

  if (!iAmLogged) {
    return null
  }

  return children
}
