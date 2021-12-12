import { MoreHorizOutlined } from '@material-ui/icons'
import React from 'react'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { colors } from 'src/styles'
import { FeedEntourageTypeColors } from 'src/utils/types'
import { FeedEntourage } from './FeedEntourage'

export default {
  title: 'FeedEntourage',
}

export function Base() {
  return (
    <TransparentWrapper style={{ width: 500 }}>
      <FeedEntourage
        distance="à 750 m - 69007"
        icon={(
          <MoreHorizOutlined style={{ color: colors.main.primary, fontSize: 22 }} />
        )}
        numberOfPeople={3}
        profilePictureURL="https://i.pravatar.cc/100"
        subtitle={(
          <span>
            <span style={{ color: FeedEntourageTypeColors.ask_for_help }}>Demande</span>
          &nbsp;de&nbsp;
            <span style={{ fontWeight: 'bold' }}>Inès D.</span>
          </span>
        )}
        title="Goearge recherche un télépone portable"
      />
    </TransparentWrapper>
  )
}

export function Active() {
  return (
    <TransparentWrapper style={{ width: 500 }}>
      <FeedEntourage
        distance="à 750 m - 69007"
        icon={(
          <MoreHorizOutlined style={{ color: colors.main.primary, fontSize: 22 }} />
        )}
        isActive={true}
        numberOfPeople={3}
        profilePictureURL="https://i.pravatar.cc/100"
        subtitle={(
          <span>
            <span style={{ color: FeedEntourageTypeColors.ask_for_help }}>Demande</span>
          &nbsp;de&nbsp;
            <span style={{ fontWeight: 'bold' }}>Inès D.</span>
          </span>
        )}
        title="Goearge recherche un télépone portable"
      />
    </TransparentWrapper>
  )
}
