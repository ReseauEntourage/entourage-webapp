import Box from '@material-ui/core/Box'
import CloseIcon from '@material-ui/icons/Close'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import { OverlayLoader } from 'src/components/OverlayLoader'
import * as S from './RightCard.styles'

type RightCardProps = {
  href: string;
  card?: ReactNode;
  footer?: JSX.Element;
  isLoading?: boolean;
}

export function RightCard(props: RightCardProps) {
  const { href, card, footer, isLoading = false } = props

  const cardComponent = (isLoading || !card) ? <OverlayLoader /> : card

  return (
    <S.Container>
      <S.Scroll>
        <Box display="flex" justifyContent="flex-end" marginRight={1}>
          <Link href={href}>
            <a>
              <CloseIcon color="primary" fontSize="large" />
            </a>
          </Link>
        </Box>
        <Box marginX={4}>
          {cardComponent}
        </Box>
        {footer}
      </S.Scroll>
    </S.Container>

  )
}
