import { formatDistance, format } from 'date-fns' // eslint-disable-line
import { fr } from 'date-fns/locale' // eslint-disable-line
import Link from 'next/link'
import React from 'react'
import { useDispatch } from 'react-redux'
import * as S from '../LeftList.styles'
import { FeedAnnouncement } from 'src/components/FeedAnnouncement'
import { FeedEntourage } from 'src/components/FeedEntourage'
import { FeedItemIcon } from 'src/components/Map'
import { constants } from 'src/constants'
import { useActionId, useNextFeed } from 'src/containers/MapContainer'
import { feedActions } from 'src/core/useCases/feed'
import { texts } from 'src/i18n'
import { useFirebase, useOnScroll } from 'src/utils/hooks'
import { formatWebLink } from 'src/utils/misc'
import { FilterEntourageType } from 'src/utils/types'

export function FeedList() {
  const actionId = useActionId()
  const dispatch = useDispatch()
  const { feeds } = useNextFeed()

  const { sendEvent } = useFirebase()

  const { onScroll } = useOnScroll({
    onScrollBottomEnd: () => {
      dispatch(feedActions.retrieveFeedNextPage())
    },
  })

  const feedsListContent = feeds.map((feedItem) => {
    if (feedItem.itemType === 'Announcement') {
      const { formattedUrl, isExternal } = formatWebLink(feedItem.webappUrl ?? feedItem.url)

      const sendWorkshopEvent = () => {
        if (formattedUrl === constants.WORKSHOP_LINK_CARD) {
          sendEvent('Action__Workshop__Card')
        }
      }

      return (
        <S.ListItem key={feedItem.uuid}>
          <FeedAnnouncement
            action={feedItem.action}
            body={feedItem.body}
            iconUrl={feedItem.iconUrl}
            imageUrl={feedItem.imageUrl}
            isExternal={isExternal}
            onClick={sendWorkshopEvent}
            title={feedItem.title}
            url={formattedUrl}
          />
        </S.ListItem>
      )
    }

    let secondText = ''
    let label = ''
    if (feedItem.groupType === 'action') {
      const createAtDistance = formatDistance(new Date(feedItem.createdAt), new Date(), { locale: fr })
      secondText = `
        Créé il y a ${createAtDistance}
        par ${feedItem.author.displayName}
      `

      const categoryTextKey = feedItem.entourageType === FilterEntourageType.CONTRIBUTION
        ? 'categoryContributionList' : 'categoryHelpList'
      label = texts.types[categoryTextKey][feedItem.displayCategory]
    }
    if (feedItem.groupType === 'outing') {
      const startDate = new Date(feedItem.metadata.startsAt)
      secondText = format(startDate, "'Rendez-vous le' d MMMM 'à' H'h'mm", { locale: fr })
      label = texts.types.event
    }

    return (
      <S.ListItem key={feedItem.uuid}>
        <Link as={`/actions/${feedItem.uuid}`} href="/actions/[actionId]">
          <S.ClickableItem onClick={() => sendEvent('Action__Feed__ListItem')}>
            <FeedEntourage
              icon={(
                <FeedItemIcon
                  displayCategory={feedItem.displayCategory}
                  entourageType={feedItem.entourageType}
                  groupType={feedItem.groupType}
                  tooltip={label}
                />
              )}
              isActive={feedItem.uuid === actionId}
              primaryText={feedItem.title}
              profilePictureURL={feedItem.author.avatarUrl}
              secondText={secondText}
            />
          </S.ClickableItem>
        </Link>
      </S.ListItem>
    )
  })

  return (
    <S.Scroll
      onScroll={onScroll}
    >
      <ul>
        {feedsListContent}
      </ul>
    </S.Scroll>
  )
}
