import { Button } from '@material-ui/core/'
import Typography from '@material-ui/core/Typography'
import React, { useCallback } from 'react'
import { variants } from 'src/styles'
import { useFirebase } from 'src/utils/hooks'
import * as S from './FeedAnnouncement.styles'

interface FeedAnnouncementProps {
  title: string;
  body?: string;
  imageUrl?: string;
  action?: string;
  url?: string;
  iconUrl: string;
}

export function FeedAnnouncement(props: FeedAnnouncementProps) {
  const { title, body, imageUrl, action, url, iconUrl } = props

  const { sendEvent } = useFirebase()

  const sendWorkshopEvent = useCallback(() => {
    // TODO find better way
    const isWorkshopCard = title.toLowerCase().includes('inscrire')
      || title.toLowerCase().includes('atelier')
      || title.toLowerCase().includes('sensibilisation')
      || (action && (
        action.toLowerCase().includes('inscrire')
        || action.toLowerCase().includes('atelier')
        || action.toLowerCase().includes('sensibilisation')
      ))

    if (isWorkshopCard) {
      sendEvent('Action__Workshop__Card')
    }
  }, [action, sendEvent, title])

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
          <Typography align="center" variant={variants.bodyRegular}>
            {body}
          </Typography>
        </S.ContentContainer>
        {
          imageUrl && (
            <a href={url} onClick={sendWorkshopEvent}>
              <S.AnnouncementImage
                alt={title}
                src={imageUrl}
              />
            </a>
          )
        }
        <S.ButtonContainer>
          <Button
            color="secondary"
            href={url}
            onClick={sendWorkshopEvent}
            size="medium"
          >
            {action}
          </Button>
        </S.ButtonContainer>
      </div>
    </S.Container>
  )
}
