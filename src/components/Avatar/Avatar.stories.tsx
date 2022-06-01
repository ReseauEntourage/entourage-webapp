import { action } from '@storybook/addon-actions'
import { text, withKnobs } from '@storybook/addon-knobs'
import React from 'react'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { Avatar } from './Avatar'

export default {
  title: 'Avatar',
  parameters: {
    component: Avatar,
  },
  decorators: [withKnobs],
}

export function Small() {
  return <Avatar size="small" src="https://i.pravatar.cc/100" />
}
export function Large() {
  return <Avatar size="large" src="https://i.pravatar.cc/100" />
}

export function WithoutSource() {
  return <Avatar src={null} />
}

export function WithClickEvent() {
  return (
    <Avatar
      onClick={action('clicked')}
      size="large"
      src="https://i.pravatar.cc/100"
    />
  )
}

export function Knobs() {
  return (
    <TransparentWrapper>
      <Avatar src={text('Url', 'https://i.pravatar.cc/100')} />
    </TransparentWrapper>
  )
}
