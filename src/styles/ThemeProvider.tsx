import ThemeProviderMUI from '@material-ui/styles/ThemeProvider'
import React from 'react'
import { theme } from './theme'

interface Props {
  children: React.ReactChild | React.ReactChild[];
}

export function ThemeProvider(props: Props) {
  const { children } = props
  return (
    <ThemeProviderMUI theme={theme}>
      {children}
    </ThemeProviderMUI>
  )
}
