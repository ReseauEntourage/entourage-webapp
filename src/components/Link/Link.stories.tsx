import React from 'react'
import { variants } from 'src/styles'
import { Link } from './Link'

export default {
  title: 'Link',
  parameters: {
    component: null,
  },
}

export function Default() {
  return (
    <Link href="https://entourage.social">
      Link
    </Link>
  )
}

export function Color() {
  return (
    <Link
      color="primary"
      href="https://entourage.social"
    >
      Link
    </Link>
  )
}

export function Variant() {
  return (
    <Link
      href="https://entourage.social"
      variant={variants.footNote}
    >
      Link
    </Link>
  )
}
