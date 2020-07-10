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

export const Small = () => <Avatar size="small" src="https://i.pravatar.cc/100" />
export const Large = () => <Avatar size="large" src="https://i.pravatar.cc/100" />

export const WithoutSource = () => <Avatar src={null} />

export const WithClickEvent = () => (
  <Avatar
    onClick={action('clicked')}
    size="large"
    src="https://i.pravatar.cc/100"
  />
)

export const Knobs = () => (
  <TransparentWrapper>
    <Avatar src={text('Url', 'https://i.pravatar.cc/100')} />
  </TransparentWrapper>
)
