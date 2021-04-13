import { Link as MaterialLink } from '@material-ui/core/'
import Typography from '@material-ui/core/Typography'
import Link from 'next/link'
import React, { useCallback } from 'react'
import { Button } from 'src/components/Button'
import { constants } from 'src/constants'
import { variants } from 'src/styles'
import { useFirebase } from 'src/utils/hooks'
import { formatWebLink } from 'src/utils/misc'
import * as S from './FeedAnnouncement.styles'

interface FeedAnnouncementProps {
  title: string;
  body: string;
  imageUrl?: string;
  action: string;
  url: string;
  webappUrl?: string;
  iconUrl: string;
}

export function FeedAnnouncement(props: FeedAnnouncementProps) {
  const { title, body, imageUrl, action, url, webappUrl, iconUrl } = props

  const { sendEvent } = useFirebase()

  const { formattedUrl, isExternal } = formatWebLink(webappUrl ?? url)

  const sendWorkshopEvent = useCallback(() => {
    if (formattedUrl === constants.WORKSHOP_LINK_CARD) {
      sendEvent('Action__Workshop__Card')
    }
  }, [formattedUrl, sendEvent])

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
                <MaterialLink href={formattedUrl} onClick={sendWorkshopEvent} target="_blank">
                  <S.AnnouncementImage
                    alt={title}
                    src={imageUrl}
                  />
                </MaterialLink>
              )
              : (
                <Link href={formattedUrl}>
                  <a>
                    <S.AnnouncementImage
                      alt={title}
                      src={imageUrl}
                    />
                  </a>
                </Link>
              )
          )
        }
        <S.ButtonContainer>
          {
            isExternal ? (
              <Button
                color="secondary"
                href={formattedUrl}
                onClick={sendWorkshopEvent}
                size="medium"
                target="_blank"
                variant="text"
              >
                {action}
              </Button>
            ) : (
              <Link href={formattedUrl}>
                <a>
                  <Button
                    color="secondary"
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
