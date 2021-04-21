import Typography from '@material-ui/core/Typography'
import Link from 'next/link'
import React from 'react'
import { Link as CustomLink } from 'src/components/Link'
import { variants } from 'src/styles'

import * as S from './FeedAnnouncement.styles'

interface FeedAnnouncementProps {
  title: string;
  body: string;
  imageUrl?: string;
  action: string;
  url?: string;
  onClick?: () => void;
  isExternal: boolean;
  iconUrl: string;
}

export function FeedAnnouncement(props: FeedAnnouncementProps) {
  const { title, body, imageUrl, action, url, iconUrl, isExternal, onClick } = props

  const image = (
    <S.AnnouncementImage
      alt={title}
      src={imageUrl}
    />
  )

  const linkTarget = isExternal ? '_blank' : '_self'

  const imageLink = (!url || isExternal) ? (
    <CustomLink href={url} onClick={onClick} target={linkTarget}>
      {image}
    </CustomLink>
  ) : (
    <Link href={url} passHref={true}>
      <CustomLink onClick={onClick}>
        {image}
      </CustomLink>
    </Link>
  )

  const buttonLink = (!url || isExternal) ? (
    <CustomLink
      color="secondary"
      href={url}
      onClick={onClick}
      target={linkTarget}
    >
      {action}
    </CustomLink>
  ) : (
    <Link href={url} passHref={true}>
      <CustomLink
        color="secondary"
        onClick={onClick}
      >
        {action}
      </CustomLink>
    </Link>
  )

  return (
    <S.Container>
      <div>
        <S.TitleContainer>
          <S.Icon
            src={iconUrl}
          />
          <Typography variant={variants.title2}>{title}</Typography>
        </S.TitleContainer>
        <S.ContentContainer>
          <Typography variant={variants.footNote}>
            {body}
          </Typography>
        </S.ContentContainer>
        {
          imageUrl && imageLink
        }
        <S.ButtonContainer>
          {buttonLink}
        </S.ButtonContainer>
      </div>
    </S.Container>
  )
}
