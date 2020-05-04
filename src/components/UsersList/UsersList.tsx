import React from 'react'
import { UserItem, UserItemProps } from './UserItem'
import { Container } from './UsersList.styles'

interface UsersListProps {
  users: UserItemProps[];
}

export function UsersList(props: UsersListProps) {
  const { users } = props
  return (
    <Container>
      {users.map((user) => <UserItem key={user.userId} {...user} />)}
    </Container>
  )
}
