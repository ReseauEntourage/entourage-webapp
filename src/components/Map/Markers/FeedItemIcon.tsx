import { Tooltip } from '@material-ui/core'

import SvgIcon from '@material-ui/core/SvgIcon'
import React, { CSSProperties } from 'react'
import { Event } from 'src/assets'
import { FeedEntourageType } from 'src/core/api'
import { FeedItem as FeedItemType } from 'src/core/useCases/feed'
import { colors } from 'src/styles'
import { feedItemCategoryIcons, roundToEven } from 'src/utils/misc'

interface FeedItemIconProps {
  displayCategory: FeedItemType['displayCategory'];
  entourageType: FeedItemType['entourageType'];
  groupType?: FeedItemType['groupType'];
  size?: number;
  isActive?: boolean;
  tooltip?: string;
}

export function FeedItemIcon(props: FeedItemIconProps) {
  const { entourageType, displayCategory, groupType, size = 28, isActive = false, tooltip } = props

  const displaySize = isActive ? size * 2 : roundToEven(size)
  const fontSize = roundToEven(displaySize / 1.4)

  const style: CSSProperties = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: displaySize,
    width: displaySize,
    cursor: 'pointer',
    zIndex: isActive ? 2 : 1,
  }

  const { width: eventIconWidth, height: eventIconHeight } = Event({}).props

  const eventIcon = (
    <div style={style}>
      <SvgIcon
        component={Event}
        style={{
          fontSize,
          color: colors.main.primary,
        }}
        viewBox={`0 0 ${eventIconWidth} ${eventIconHeight}`}
      />
    </div>
  )

  const iconColors: Record<FeedEntourageType, string> = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    ask_for_help: colors.main.primary,
    contribution: colors.main.blue,
  }

  const IconComponent = feedItemCategoryIcons[displayCategory] || feedItemCategoryIcons.other

  const { width, height } = IconComponent({}).props

  const content = (groupType && groupType === 'outing')
    ? eventIcon : (
      <div style={style}>
        <SvgIcon
          component={IconComponent}
          style={{
            fontSize,
            color: iconColors[entourageType],
          }}
          viewBox={`0 0 ${width} ${height}`}
        />
      </div>
    )

  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        {content}
      </Tooltip>
    )
  }

  return content
}
