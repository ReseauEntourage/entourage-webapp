import { useRouter } from 'next/router'
import { texts } from 'src/i18n'

export type Path = '/actions' | '/pois' | '/messages' | '/'

const routeTitles: Record<Path, string> = {
  '/actions': texts.nav.pageTitles.actions,
  '/pois': texts.nav.pageTitles.pois,
  '/messages': texts.nav.pageTitles.messages,
  '/': '',
}

interface CurrentRoute {
  currentRoute: Path;
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
