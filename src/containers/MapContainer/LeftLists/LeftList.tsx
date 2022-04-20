import Box from '@material-ui/core/Box'
import Link from 'next/link'
import React from 'react'
import { Link as CustomLink } from 'src/components/Link'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { constants } from 'src/constants'
import { texts } from 'src/i18n'
import { variants } from 'src/styles'
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
        {list}
        {isLoading && <OverlayLoader />}
      </S.ListContainer>
      <Box />
      <Box
        bgcolor="white"
        boxShadow={4}
        display="flex"
        justifyContent="space-evenly"
        zIndex={3}
      >
        <CustomLink href={constants.CGU_LINK} target="_blank" variant={variants.footNote}>{texts.nav.cgu}</CustomLink>
        <Link href="#cookies">
          <CustomLink variant={variants.footNote}>{texts.nav.cookies}</CustomLink>
        </Link>
      </Box>
    </S.Container>
  )
})
