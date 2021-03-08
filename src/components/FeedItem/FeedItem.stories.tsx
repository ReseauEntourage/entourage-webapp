import React from 'react'
import { FeedItemIcon } from '../Map'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { FeedItem } from './FeedItem'

export default {
  title: 'FeedItem',
}

export const Base = () => (
  <TransparentWrapper style={{ width: 500 }}>
    <FeedItem
      icon={(
        <FeedItemIcon
          displayCategory="social"
          entourageType="contribution"
          groupType="action"
          tooltip="Passer du temps avec une personne"
        />
      )}
      primaryText=" Goearge recherche un télépone portable"
      profilePictureURL="https://i.pravatar.cc/100"
      secondText="Créé ce mois-ci par Ines"
    />
  </TransparentWrapper>
)

export const Active = () => (
  <TransparentWrapper style={{ width: 500 }}>
    <FeedItem
      isActive={true}
      primaryText=" Goearge recherche un télépone portable"
      profilePictureURL="https://i.pravatar.cc/100"
      secondText="Créé ce mois-ci par Ines"
    />
  </TransparentWrapper>
)
