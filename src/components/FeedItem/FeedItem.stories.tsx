import LocalMallIcon from '@material-ui/icons/LocalMall'
import React from 'react'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { FeedItem, iconStyle } from './FeedItem'

export default {
  title: 'FeedItem',
}

export const Base = () => (
  <TransparentWrapper style={{ width: 500 }}>
    <FeedItem
      icon={<LocalMallIcon style={{ ...iconStyle, color: '#fff', backgroundColor: '#f00' }} />}
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
