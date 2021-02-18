import {
  LocalMall,
  Event,
  LocalLaundryService,
  People,
  Help,
  MoreHoriz,
  Create,
  SvgIconComponent,
} from '@material-ui/icons'
import { formatDistance, format } from 'date-fns' // eslint-disable-line
import { fr } from 'date-fns/locale' // eslint-disable-line
import Link from 'next/link'
import React from 'react'
import { useDispatch } from 'react-redux'
import * as S from '../LeftList.styles'
import { FeedItem, iconStyle } from 'src/components/FeedItem'
import { useActionId, useNextFeed } from 'src/containers/MapContainer'
import { FeedDisplayCategory, FeedEntourageType } from 'src/core/api'
import { FeedItem as FeedItemType, feedActions } from 'src/core/useCases/feed'
import { colors } from 'src/styles'
import { useOnScroll } from 'src/utils/hooks'

interface FeedItemIconProps {
  feedItem: FeedItemType;
}

const feedItemCategoryIcons: Record<FeedDisplayCategory, SvgIconComponent> = {
  info: Help,
  // eslint-disable-next-line @typescript-eslint/camelcase
  mat_help: LocalMall,
  other: MoreHoriz,
  skill: Create,
  social: People,
  resource: LocalLaundryService,
}

function FeedItemIcon(props: FeedItemIconProps) {
  const { feedItem } = props
  const { entourageType, displayCategory, groupType } = feedItem

  if (groupType === 'outing') {
    return (
      <Event
        style={{
          ...iconStyle,
          color: '#fff',
          backgroundColor: colors.main.grey,
        }}
      />
    )
  }

  const backgroundColors: Record<FeedEntourageType, string> = {
    contribution: colors.main.primary,
    // eslint-disable-next-line @typescript-eslint/camelcase
    ask_for_help: colors.main.blue,
  }

  const iconProps = {
    style: {
      ...iconStyle,
      color: '#fff',
      backgroundColor: backgroundColors[entourageType],
    },
  }

  const IconComponent = feedItemCategoryIcons[displayCategory] || feedItemCategoryIcons.other

  return (
    <IconComponent {...iconProps} />
  )
}

export function FeedList() {
  const actionId = useActionId()
  const dispatch = useDispatch()
  const { feeds } = useNextFeed()

  const { onScroll } = useOnScroll({
    onScrollBottomEnd: () => {
      dispatch(feedActions.retrieveFeedNextPage())
    },
  })

  const feedsListContent = feeds.map((feedItem) => {
    let secondText = ''
    if (feedItem.groupType === 'action') {
      const createAtDistance = formatDistance(new Date(feedItem.createdAt), new Date(), { locale: fr })
      secondText = `
        Créé il y a ${createAtDistance}
        par ${feedItem.author.displayName}
      `
    }
    if (feedItem.groupType === 'outing') {
      const startDate = new Date(feedItem.metadata.startsAt)
      secondText = format(startDate, "'Rendez-vous le' d MMMM 'à' H'h'mm", { locale: fr })
    }

    return (
      <S.ListItem key={feedItem.uuid}>
        <Link as={`/actions/${feedItem.uuid}`} href="/actions/[actionId]">
          <a style={{ textDecoration: 'none' }}>
            <FeedItem
              key={feedItem.uuid}
              icon={<FeedItemIcon feedItem={feedItem} />}
              isActive={feedItem.uuid === actionId}
              primaryText={feedItem.title}
              profilePictureURL={feedItem.author.avatarUrl}
              secondText={secondText}
            />
          </a>
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
