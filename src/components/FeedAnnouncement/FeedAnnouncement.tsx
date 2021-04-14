import { Link as MaterialLink } from '@material-ui/core/'
import Typography from '@material-ui/core/Typography'
import Link from 'next/link'
import React from 'react'
import { Button } from 'src/components/Button'
import { variants } from 'src/styles'

import * as S from './FeedAnnouncement.styles'

interface FeedAnnouncementProps {
  title: string;
  body: string;
  imageUrl?: string;
  action: string;
  url: string;
  onClick?: () => void;
  isExternal: boolean;
  iconUrl: string;
}

export function FeedAnnouncement(props: FeedAnnouncementProps) {
  const { title, body, imageUrl, action, url, iconUrl, isExternal, onClick } = props

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
          <Typography variant={variants.bodyRegular}>
            {body}
          </Typography>
        </S.ContentContainer>
        {
          imageUrl && (
            isExternal
              ? (
                <MaterialLink href={url} onClick={onClick} target="_blank">
                  <S.AnnouncementImage
                    alt={title}
                    src={imageUrl}
                  />
                </MaterialLink>
              )
              : (
                <Link href={url}>
                  <MaterialLink onClick={onClick}>
                    <S.AnnouncementImage
                      alt={title}
                      src={imageUrl}
                    />
                  </MaterialLink>
                </Link>
              )
          )
        }
        <S.ButtonContainer>
          {
            isExternal ? (
              <Button
                color="secondary"
                href={url}
                onClick={onClick}
                size="medium"
                target="_blank"
                variant="text"
              >
                {action}
              </Button>
            ) : (
              <Link href={url}>
                <a>
                  <Button
                    color="secondary"
                    onClick={onClick}
                    size="medium"
                    variant="text"
                  >
                    {action}
                  </Button>
                </a>
              </Link>
            )
          }
        </S.ButtonContainer>
      </div>
    </S.Container>
  )
}
