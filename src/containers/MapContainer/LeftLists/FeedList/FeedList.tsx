import { format, isSameDay} from 'date-fns' // eslint-disable-line
import { fr } from 'date-fns/locale' // eslint-disable-line
import { getDistance } from 'geolib'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as S from '../LeftList.styles'
import { FeedAnnouncement } from 'src/components/FeedAnnouncement'
import { FeedEntourage } from 'src/components/FeedEntourage'
import { Link as CustomLink } from 'src/components/Link'
import { FeedItemIcon } from 'src/components/Map'
import { openModal } from 'src/components/Modal'
import { constants } from 'src/constants'
import { useActionId, useNextFeed } from 'src/containers/MapContainer'
import { ModalSignIn } from 'src/containers/ModalSignIn'
import { feedActions } from 'src/core/useCases/feed'
import { selectGeolocation } from 'src/core/useCases/location'
import { texts } from 'src/i18n'
import { useFirebase, useOnScroll } from 'src/utils/hooks'
import { formatWebLink } from 'src/utils/misc'
import { FilterEntourageType } from 'src/utils/types'

export function FeedList() {
  const actionId = useActionId()
  const dispatch = useDispatch()
  const { feeds } = useNextFeed()
  const geolocation = useSelector(selectGeolocation)

  const { sendEvent } = useFirebase()

  const router = useRouter()

  const { onScroll } = useOnScroll({
    onScrollBottomEnd: () => {
      dispatch(feedActions.retrieveFeedNextPage())
    },
  })

  const feedsListContent = feeds.map((feedItem) => {
    if (feedItem.itemType === 'Announcement') {
      const { formattedUrl, isExternal, authRequired } = formatWebLink(feedItem.webappUrl ?? feedItem.url)

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
    let distance = ''
    let distanceString = ''
    let label = ''

    if (geolocation) {
      const { lat, lng } = geolocation

      const distanceInMeters = getDistance({ lat, lng }, feedItem.location)

      if (distanceInMeters > 1000) {
        distance = `${Math.round(distanceInMeters / 1000)} km`
      } else {
        distance = `${distanceInMeters.toString()} m`
      }

      distanceString = `à ${distance}`
    } else {
      distanceString = feedItem.postalCode ?? ''
    }
    distanceString += feedItem.postalCode ? ` - ${feedItem.postalCode}` : ''

    if (feedItem.groupType === 'action') {
      const categoryTextKey = feedItem.entourageType === FilterEntourageType.CONTRIBUTION
        ? 'categoryContributionList' : 'categoryHelpList'

      label = texts.types[categoryTextKey][feedItem.displayCategory]
      const category = texts.content.map.actions[feedItem.entourageType]

      subtitle = (
        <span>
          <S.Colored category={feedItem.entourageType}>{category}</S.Colored>
          &nbsp;de&nbsp;
          <S.Bold>{feedItem.author.displayName}</S.Bold>
        </span>
      )
    }

    if (feedItem.groupType === 'outing') {
      const startDate = new Date(feedItem.metadata.startsAt)
      if (feedItem.metadata.endsAt && !isSameDay(startDate, new Date(feedItem.metadata.endsAt))) {
        const endDate = new Date(feedItem.metadata.endsAt)
        subtitle = `${
          format(startDate, "'Événement du' dd/MM", { locale: fr })
        }  ${
          format(endDate, "'au' dd/MM", { locale: fr })
        }`
      } else {
        subtitle = `${format(startDate, "'Événement le' eeee dd/MM", { locale: fr })}`
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
    </S.Scroll>
  )
}
