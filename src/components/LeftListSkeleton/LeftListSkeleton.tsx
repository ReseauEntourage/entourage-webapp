import React from 'react'
import { LeftListItemSkeleton } from './LeftListItemSkeleton'
import * as S from './LeftListSkeleton.styles'

export function LeftListSkeleton() {
  const skeletons = []
  for (let i = 0; i <= 15; i += 1) {
    skeletons.push(
      <S.ListItem key={i}>
        <LeftListItemSkeleton />
      </S.ListItem>,
    )
  }

  return (
    <S.Scroll>
      <ul>
        {skeletons}
      </ul>
    </S.Scroll>
  )
}
