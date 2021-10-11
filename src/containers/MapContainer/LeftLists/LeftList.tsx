import Box from '@material-ui/core/Box'
import React from 'react'
import { LeftListSkeleton } from 'src/components/LeftListSkeleton'
import * as S from './LeftList.styles'
import { SearchCity } from './SearchCity'

interface LeftListProps {
  isLoading: boolean;
  list: JSX.Element;
  filters?: JSX.Element;
}

export const LeftList = React.memo((props: LeftListProps) => {
  const { isLoading, list, filters } = props
  return (
    <S.Container>
      <S.SearchContainer>
        <SearchCity filters={filters} />
      </S.SearchContainer>
      <S.ListContainer
        boxShadow={4}
        width={350}
        zIndex={2}
      >
        {isLoading ? <LeftListSkeleton /> : list}
      </S.ListContainer>
      <Box />
    </S.Container>
  )
})
