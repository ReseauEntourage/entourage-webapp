import React from 'react'
import { UserItem, UserItemProps } from './UserItem'
import { Container } from './UsersList.styles'

interface Props {
  users: UserItemProps[];
}

export function UsersList(props: Props) {
  const { users } = props
  return (
    <Container>
      {users.map((user) => <UserItem key={user.userId} {...user} />)}
    </Container>
  )
}
