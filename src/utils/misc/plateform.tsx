import React, { useState } from 'react'
import { useIsDesktop } from 'src/styles'
import { useMount } from 'src/utils/hooks'
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
    const isDesktop = useIsDesktop()
    const [key, setKey] = useState<number>(0)

    // force refresh on client side after first render
    // because of lack of SSR screen width info
    useMount(() => {
      setKey(new Date().getTime())
    })

    if (Desktop && isDesktop) {
      return <Desktop key={key} {...props} />
    }

    if (Mobile) {
      return <Mobile key={key} {...props} />
    }

    throw new Error('plateform error')
  }
}
