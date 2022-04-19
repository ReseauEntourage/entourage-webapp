import { Mail } from '@material-ui/icons'
import React from 'react'
import { ContactLink } from './ContactLink'

export default {
  title: 'ContactLink',
  parameters: {
    component: null,
  },
}

export function Default() {
  return (
    <ContactLink
      icon={<Mail />}
      info="contact@entourage.social"
      link="mailto:contact@entourage.social"
    />
  )
}

export function Disabled() {
  return (
    <ContactLink
      disabled={true}
      icon={<Mail />}
      info="contact@entourage.social"
      link="mailto:contact@entourage.social"
    />
  )
}

export function Color() {
  return (
    <ContactLink
      color="secondary"
      icon={<Mail />}
      info="contact@entourage.social"
      link="mailto:contact@entourage.social"
    />
  )
}
