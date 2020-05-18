import React from 'react'
import { UserItem, UserItemProps } from './UserItem'
import { Container } from './UsersList.styles'

interface UsersListProps {
  onClickUser?: (userId: string) => void;
  users: UserItemProps[];
}

export function UsersList(props: UsersListProps) {
  const { users, onClickUser } = props
  return (
    <Container>
      {users.map((user) => <UserItem key={user.userId} onClick={onClickUser} {...user} />)}
    </Container>
  )
}
