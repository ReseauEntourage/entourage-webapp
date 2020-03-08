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

export const standard = () => <Avatar src="https://i.pravatar.cc/100" />
export const withoutSource = () => <Avatar src={null} />

export const knobs = () => (
  <TransparentWrapper>
    <Avatar src={text('Url', 'https://i.pravatar.cc/100')} />
  </TransparentWrapper>
)
