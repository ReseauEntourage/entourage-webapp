import Box from '@material-ui/core/Box'
import CloseIcon from '@material-ui/icons/Close'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import { Link as CustomLink } from 'src/components/Link'
import { OverlayLoader } from 'src/components/OverlayLoader'
import * as S from './RightCard.styles'

type RightCardProps = {
  href: string;
  card?: ReactNode;
  footer?: JSX.Element;
  isLoading?: boolean;
  imageUrl?: string;
}

export function RightCard(props: RightCardProps) {
  const { href, card, footer, isLoading = false, imageUrl } = props

  const cardComponent = (isLoading || !card) ? <OverlayLoader /> : card

  return (
    <S.Container>
      <S.Scroll>
        {imageUrl && <S.Image alt="Événement Entourage" src={imageUrl} />}
        <S.ContentContainer>
          <Box display="flex" justifyContent="flex-end" marginRight={1}>
            <Link href={href} passHref={true}>
              <CustomLink>
                <CloseIcon color="primary" />
              </CustomLink>
            </Link>
          </Box>
          <Box marginX={4}>
            {cardComponent}
          </Box>
          {footer}
        </S.ContentContainer>
      </S.Scroll>
    </S.Container>

  )
}
