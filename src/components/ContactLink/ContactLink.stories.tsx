import { Mail } from '@material-ui/icons'
import React from 'react'
import { ContactLink } from './ContactLink'

export default {
  title: 'ContactLink',
  parameters: {
    component: null,
  },
}

export const Default = () => (
  <ContactLink
    icon={<Mail />}
    info="contact@entourage.social"
    link="mailto:contact@entourage.social"
  />
)

export const Disabled = () => (
  <ContactLink
    disabled={true}
    icon={<Mail />}
    info="contact@entourage.social"
    link="mailto:contact@entourage.social"
  />
)

export const Color = () => (
  <ContactLink
    color="secondary"
    icon={<Mail />}
    info="contact@entourage.social"
    link="mailto:contact@entourage.social"
  />
)
