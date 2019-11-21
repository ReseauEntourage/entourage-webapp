import React from 'react'
import { colors } from 'src/styles'
import { FeedItem } from './FeedItem'

export default {
  title: 'FeedItem',
}

export const Base = () => (
  <div style={{ border: `solid 1px ${colors.borderColor}` }}>
    <FeedItem
      primaryText=" Goearge recherche un télépone portable"
      secondText="Créé ce mois-ci par Ines"
      profilePictureURL="https://i.pravatar.cc/100"
    />
  </div>
)

export const Active = () => (
  <div style={{ border: `solid 1px ${colors.borderColor}` }}>
    <FeedItem
      primaryText=" Goearge recherche un télépone portable"
      secondText="Créé ce mois-ci par Ines"
      profilePictureURL="https://i.pravatar.cc/100"
      isActive={true}
    />
  </div>
)
