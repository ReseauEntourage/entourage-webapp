import { Event } from '@material-ui/icons'
import React from 'react'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { colors } from 'src/styles'
import { FeedEntourage } from './FeedEntourage'

export default {
  title: 'FeedEntourage',
}

export const Base = () => (
  <TransparentWrapper style={{ width: 500 }}>
    <FeedEntourage
      icon={(
        <Event style={{ color: colors.main.primary, fontSize: 22 }} />
      )}
      numberOfPeople={3}
      primaryText=" Goearge recherche un télépone portable"
      profilePictureURL="https://i.pravatar.cc/100"
      secondText="Créé ce mois-ci par Ines"
    />
  </TransparentWrapper>
)

export const Active = () => (
  <TransparentWrapper style={{ width: 500 }}>
    <FeedEntourage
      icon={(
        <Event style={{ color: colors.main.primary, fontSize: 22 }} />
      )}
      isActive={true}
      numberOfPeople={3}
      primaryText=" Goearge recherche un télépone portable"
      profilePictureURL="https://i.pravatar.cc/100"
      secondText="Créé ce mois-ci par Ines"
    />
  </TransparentWrapper>
)
