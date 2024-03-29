import { Tooltip } from '@material-ui/core'

import SvgIcon from '@material-ui/core/SvgIcon'
import React, { CSSProperties } from 'react'
import { Event } from 'src/assets'
import { FeedEntourage as FeedItemType } from 'src/core/useCases/feed'
import { colors } from 'src/styles'
import { feedItemCategoryIcons, roundToEven } from 'src/utils/misc'
import { FeedEntourageTypeColors } from 'src/utils/types'

interface FeedItemIconProps {
  displayCategory: FeedItemType['displayCategory'];
  entourageType: FeedItemType['entourageType'];
  groupType?: FeedItemType['groupType'];
  size?: number;
  isActive?: boolean;
  tooltip?: string;
}

export function FeedItemIcon(props: FeedItemIconProps) {
  const { entourageType, displayCategory, groupType, size = 22, isActive = false, tooltip } = props

  const displaySize = isActive ? size * 2 : roundToEven(size)
  const fontSize = roundToEven(displaySize)

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

  const IconComponent = feedItemCategoryIcons[displayCategory] || feedItemCategoryIcons.other

  const { width, height } = IconComponent({}).props

  const content = (groupType && groupType === 'outing')
    ? eventIcon : (
      <div style={style}>
        <SvgIcon
          style={{
            fontSize,
            color: FeedEntourageTypeColors[entourageType],
          }}
          viewBox={`0 0 ${width} ${height}`}
        >
          <IconComponent />
        </SvgIcon>
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
