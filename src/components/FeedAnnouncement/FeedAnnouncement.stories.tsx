import React from 'react'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { FeedAnnouncement } from './FeedAnnouncement'

export default {
  title: 'FeedAnnouncement',
}

export const Base = () => (
  <TransparentWrapper style={{ width: 500 }}>
    <FeedAnnouncement
      action="Je découvre"
      body="Le témoignage quotidien d'une personne SDF qui raconte sa façon de vivre le confinement."
      iconUrl="https://entourage-back-preprod.herokuapp.com/api/v1/announcements/64/icon"
      title="Journal du confinement"
      /* eslint-disable-next-line max-len */
      url="https://entourage-back-preprod.herokuapp.com/api/v1/announcements/64/redirect/e59866c68b39596c23bd4d71a7b03241"
    />
  </TransparentWrapper>
)
