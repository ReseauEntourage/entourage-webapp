import { useWindowWidth } from '@react-hook/window-size'
import React from 'react'
import { breakpoints } from 'src/styles'
import { isSSR } from 'src/utils/misc'
import { AnyCantFix } from 'src/utils/types'

interface PlateformParams<T> {
  Desktop?: T;
  Mobile?: T;
}

export function plateform<T extends React.ComponentType<AnyCantFix>>(data: PlateformParams<T>): T {
  const { Mobile, Desktop } = data

  // ignore type error because return statement is already typed
  // @ts-ignore
  return (props: React.ComponentProps<typeof T>) => {
    const windowWidth = useWindowWidth()

    const isDesktop = windowWidth >= breakpoints.mobile

    // TODO: manage SSR mode
    if (isSSR) {
      return null
    }

    if (Desktop && isDesktop) {
      return <Desktop {...props} />
    }

    if (Mobile) {
      return <Mobile {...props} />
    }

    throw new Error('plateform error')
  }
}
