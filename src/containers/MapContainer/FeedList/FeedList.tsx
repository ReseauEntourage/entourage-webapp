import Box from '@material-ui/core/Box'
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
import { FeedDisplayCategory } from '../../../core/api'
import { useActionId } from '../useActionId'
import { useNextFeed } from '../useNextFeed'
import { FeedItem, iconStyle } from 'src/components/FeedItem'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { FeedItem as FeedItemType, feedActions } from 'src/core/useCases/feed'
import { colors } from 'src/styles'
import { useOnScroll } from 'src/utils/hooks'
import * as S from './FeedList.styles'
import { SearchCity } from './SearchCity'

interface FeedItemIconProps {
  feedItem: FeedItemType;
}

const feedItemCategoryIconMap: Record<FeedDisplayCategory, SvgIconComponent> = {
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

  const getIconProps = (backgroundColor: string) => ({
    style: {
      ...iconStyle, color: '#fff', backgroundColor,
    },
  })

  let iconBackgroundColor = colors.main.grey

  if (groupType === 'outing') {
    return (
      <Event {...getIconProps(iconBackgroundColor)} />
    )
  }
  if (entourageType === 'contribution') {
    iconBackgroundColor = colors.main.primary
  } else if (entourageType === 'ask_for_help') {
    iconBackgroundColor = colors.main.blue
  }

  let IconComponent = feedItemCategoryIconMap.other

  if (displayCategory) {
    IconComponent = feedItemCategoryIconMap[displayCategory]
  }

  return (
    <IconComponent {...getIconProps(iconBackgroundColor)} />
  )
}

export function FeedList() {
  const actionId = useActionId()
  const dispatch = useDispatch()
  const { feeds, isLoading } = useNextFeed()

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
      <li key={feedItem.uuid}>
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
      </li>
    )
  })

  return (
    <S.Container>
      <S.SearchContainer>
        <SearchCity />
      </S.SearchContainer>
      <S.FeedContainer
        boxShadow={4}
        width={350}
        zIndex={2}
      >
        <S.Scroll
          onScroll={onScroll}
        >
          <ul>{feedsListContent}</ul>
        </S.Scroll>
        {isLoading && <OverlayLoader />}
      </S.FeedContainer>
      <Box />
    </S.Container>
  )
}
