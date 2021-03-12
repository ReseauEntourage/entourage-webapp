import Box from '@material-ui/core/Box'
import { useRouter } from 'next/router'
import React from 'react'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { FeedFiltersSelector } from './FeedFiltersSelector/FeedFiltersSelector'
import * as S from './LeftList.styles'
import { SearchCity } from './SearchCity'

interface LeftListProps {
  isLoading: boolean;
  list: JSX.Element;
}

export function LeftList(props: LeftListProps) {
  const { isLoading, list } = props
  const router = useRouter()

  const isFeedPage = router.pathname.split('/')[1] === 'actions'

  return (
    <S.Container>
      <S.SearchContainer>
        <SearchCity />
        {isFeedPage && <FeedFiltersSelector />}
      </S.SearchContainer>
      <S.ListContainer
        boxShadow={4}
        width={350}
        zIndex={2}
      >
        {list}
        {isLoading && <OverlayLoader />}
      </S.ListContainer>
      <Box />
    </S.Container>
  )
}
