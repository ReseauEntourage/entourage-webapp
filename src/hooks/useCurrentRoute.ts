import { useRouter } from 'next/router'
import { texts } from 'src/i18n'

export type Path = '/actions' | '/pois' | '/messages' | '/'

const routeTitles: Record<Path, string> = {
  '/actions': texts.nav.pageTitles.actions,
  '/pois': texts.nav.pageTitles.pois,
  '/messages': texts.nav.pageTitles.messages,
  '/': '',
}

export function useCurrentRoute() {
  const router = useRouter()
  let currentRoute: Path
  let routeTitle
  if (router.pathname.includes('/actions')) {
    currentRoute = '/actions'
    routeTitle = routeTitles[currentRoute]
  } else if (router.pathname.includes('/pois')) {
    currentRoute = '/pois'
    routeTitle = routeTitles[currentRoute]
  } else if (router.pathname.includes('/messages')) {
    currentRoute = '/messages'
    routeTitle = routeTitles[currentRoute]
  } else {
    currentRoute = '/'
    routeTitle = routeTitles[currentRoute]
  }

  return { currentRoute, routeTitle }
}
