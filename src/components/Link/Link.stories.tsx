import React from 'react'
import { variants } from 'src/styles'
import { Link } from './Link'

export default {
  title: 'Link',
  parameters: {
    component: null,
  },
}

export const Default = () => (
  <Link href="https://entourage.social">
    Link
  </Link>
)

export const Color = () => (
  <Link
    color="primary"
    href="https://entourage.social"
  >
    Link
  </Link>
)

export const Variant = () => (
  <Link
    href="https://entourage.social"
    variant={variants.footNote}
  >
    Link
  </Link>
)
