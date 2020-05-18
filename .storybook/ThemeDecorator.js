import React from 'react'
import { ThemeProvider } from '../src/styles/ThemeProvider'

export function ThemeDecorator(storyFn) {
  return <ThemeProvider>{storyFn()}</ThemeProvider>
}
