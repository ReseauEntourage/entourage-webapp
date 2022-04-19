import { format, isSameDay} from 'date-fns' // eslint-disable-line
import { fr } from 'date-fns/locale' // eslint-disable-line
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useDispatch } from 'react-redux'
import * as S from '../LeftList.styles'
import { NoContent } from '../NoContent'
import { FeedAnnouncement } from 'src/components/FeedAnnouncement'
import { FeedEntourage } from 'src/components/FeedEntourage'
import { Link as CustomLink } from 'src/components/Link'
import { FeedItemIcon } from 'src/components/Map'
import { openModal } from 'src/components/Modal'
import { constants } from 'src/constants'
import { useActionId, useNextFeed } from 'src/containers/MapContainer'
import { ModalSignIn } from 'src/containers/ModalSignIn'
import { feedActions } from 'src/core/useCases/feed'
import { texts } from 'src/i18n'
import { useFirebase, useOnScroll, useGetDistanceFromPosition } from 'src/utils/hooks'

import { formatWebLink } from 'src/utils/misc'
import { FilterEntourageType, FeedMetadata } from 'src/utils/types'

export function FeedList() {
  const actionId = useActionId()
  const dispatch = useDispatch()
  const { feeds } = useNextFeed()
  const getDistanceFromPosition = useGetDistanceFromPosition()
  const { sendEvent } = useFirebase()

  const router = useRouter()

  const { onScroll } = useOnScroll({
    onScrollBottomEnd: () => {
      dispatch(feedActions.retrieveFeedNextPage())
    },
  })

  const feedsListContent = feeds.map((feedItem) => {
    if (feedItem.itemType === 'Announcement') {
      const { formattedUrl, isExternal, authRequired } = formatWebLink(feedItem.webappUrl || feedItem.url)

      const onClick = () => {
        if (authRequired) {
          openModal(<ModalSignIn onSuccess={() => router.push(formattedUrl)} />)
        } else if (formattedUrl === constants.WORKSHOP_LINK_CARD) {
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
            onClick={onClick}
            title={feedItem.title}
            url={authRequired ? undefined : formattedUrl}
          />
        </S.ListItem>
      )
    }

    let subtitle
    const distance = getDistanceFromPosition(feedItem.location)
    let distanceString = ''
    let label = ''

    if (distance && feedItem.postalCode) {
      distanceString = `${distance} - ${feedItem.postalCode}`
    } else if (distance) {
      distanceString = `${distance}`
    } else if (feedItem.postalCode) {
      distanceString = feedItem.postalCode
    }

    if (feedItem.groupType === 'action') {
      const categoryTextKey = feedItem.entourageType === FilterEntourageType.CONTRIBUTION
        ? 'categoryContributionList' : 'categoryHelpList'

      label = texts.types[categoryTextKey][feedItem.displayCategory]
      const category = texts.content.map.actions[feedItem.entourageType]

      subtitle = (
        <span>
          <S.Colored category={feedItem.entourageType}>{category}&nbsp;de&nbsp;</S.Colored>
          <S.Bold>{feedItem.author.displayName}</S.Bold>
        </span>
      )
    }

    if (feedItem.groupType === 'outing') {
      const metadata = feedItem.metadata as FeedMetadata<'outing'>
      if (metadata.startsAt) {
        const startDate = new Date(metadata.startsAt)
        if (metadata.endsAt && !isSameDay(startDate, new Date(metadata.endsAt))) {
          const endDate = new Date(metadata.endsAt)
          subtitle = `${
            format(startDate, "'Événement du' dd/MM", { locale: fr })
          }  ${
            format(endDate, "'au' dd/MM", { locale: fr })
          }`
        } else {
          subtitle = `${format(startDate, "'Événement le' eeee dd/MM", { locale: fr })}`
        }
      }

      label = texts.types.event

      if (feedItem.online) {
        distanceString = texts.content.map.actions.online
      }
    }

    return (
      <S.ListItem key={feedItem.uuid}>
        <Link
          as={`/actions/${feedItem.uuid}`}
          href="/actions/[actionId]"
          passHref={true}
        >
          <CustomLink
            disableHover={true}
            onClick={() => sendEvent('Action__Feed__ListItem')}
            style={{ width: '100%' }}
          >
            <FeedEntourage
              distance={distanceString}
              icon={(
                <FeedItemIcon
                  displayCategory={feedItem.displayCategory}
                  entourageType={feedItem.entourageType}
                  groupType={feedItem.groupType}
                  tooltip={label}
                />
              )}
              isActive={feedItem.uuid === actionId}
              numberOfPeople={feedItem.numberOfPeople}
              profilePictureURL={feedItem.author.avatarUrl}
              subtitle={subtitle}
              title={feedItem.title}
            />
          </CustomLink>
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
      {feeds.filter((feedItem) => feedItem.itemType === 'Entourage'
        && (feedItem.groupType === 'action'
          || (feedItem.groupType === 'outing' && !feedItem.online)
        )).length === 0 && <NoContent text={texts.content.map.actions.noActions.list} />}
    </S.Scroll>
  )
}
