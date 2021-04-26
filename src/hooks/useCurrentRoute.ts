import { useRouter } from 'next/router'
import { texts } from 'src/i18n'
import { Route } from 'src/utils/types'

const routeTitles: Record<Route, string> = {
  '/actions': texts.nav.pageTitles.actions,
  '/pois': texts.nav.pageTitles.pois,
  '/messages': texts.nav.pageTitles.messages,
  '/': '',
}

interface CurrentRoute {
  currentRoute: Route;
  routeTitle: string;
}

export function useCurrentRoute(): CurrentRoute {
  const router = useRouter()

  if (router.pathname.includes('/actions')) {
    return {
      currentRoute: '/actions',
      routeTitle: routeTitles['/actions'],
    }
  }

  if (router.pathname.includes('/pois')) {
    return {
      currentRoute: '/pois',
      routeTitle: routeTitles['/pois'],
    }
  }

  if (router.pathname.includes('/messages')) {
    return {
      currentRoute: '/messages',
      routeTitle: routeTitles['/messages'],
    }
  }

  return {
    currentRoute: '/',
    routeTitle: routeTitles['/'],
  }
}
