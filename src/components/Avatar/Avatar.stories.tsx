import React from 'react'
import { Avatar } from './Avatar'

export default {
  title: 'Avatar',
  parameters: {
    component: Avatar,
  },
}

export const standard = () => <Avatar src="https://i.pravatar.cc/100" />
export const withoutSource = () => <Avatar src={null} />
