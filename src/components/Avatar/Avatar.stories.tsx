import React from 'react'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { Avatar } from './Avatar'

export default {
  title: 'Avatar',
}

export const AvatarExample = () => (
  <>
    <TransparentWrapper>
      <Avatar
        src="https://i.pravatar.cc/100"
      />
    </TransparentWrapper>
    <TransparentWrapper>
      <Avatar
        src={null}
      />
    </TransparentWrapper>
  </>
)
