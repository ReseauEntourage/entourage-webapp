import Box from '@material-ui/core/Box'
import { LocalMall, Event, LocalLaundryService, People, Help, MoreHoriz, Create } from '@material-ui/icons'
import { formatDistance, format } from 'date-fns' // eslint-disable-line
import { fr } from 'date-fns/locale' // eslint-disable-line
import Link from 'next/link'
import React from 'react'
import { useDispatch } from 'react-redux'
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

function FeedItemIcon(props: FeedItemIconProps) {
  const { feedItem } = props
  const { entourageType, displayCategory, groupType } = feedItem

  let backgroundColor = colors.main.grey

  const getIconProps = () => ({
    style: {
      ...iconStyle, color: '#fff', backgroundColor,
    },
  })

  if (groupType === 'outing') {
    return (
      <Event {...getIconProps()} />
    )
  }
  if (entourageType === 'contribution') {
    backgroundColor = colors.main.primary
  } else if (entourageType === 'ask_for_help') {
    backgroundColor = colors.main.blue
  }

  switch (displayCategory) {
    case 'resource':
      return <LocalLaundryService {...getIconProps()} />
    case 'skill':
      return <Create {...getIconProps()} />
    case 'social':
      return <People {...getIconProps()} />
    case 'mat_help':
      return <LocalMall {...getIconProps()} />
    case 'info':
      return <Help {...getIconProps()} />
    case 'other':
    default:
      return <MoreHoriz {...getIconProps()} />
  }
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
