import React from 'react'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { UsersList as UsersListCpmt } from './UsersList'

export default {
  title: 'UsersList',
}

export const UsersList = () => {
  return (
    <TransparentWrapper style={{ maxWidth: 400 }}>
      <UsersListCpmt
        users={[
          {
            userId: 1,
            userName: 'Tristan',
            profilePictureURL: 'https://i.pravatar.cc/100',
            isPartner: false,
            isOwner: true,
          },
          {
            userId: 2,
            userName: 'Emma',
            profilePictureURL: 'https://i.pravatar.cc/100',
            isPartner: true,
            partnerName: 'Entourage',
            isOwner: false,
          },
          {
            userId: 3,
            userName: 'Valentin',
            profilePictureURL: 'https://i.pravatar.cc/100',
            isPartner: false,
            isOwner: false,
          },
        ]}
      />
    </TransparentWrapper>
  )
}
