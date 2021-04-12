import { ContainerProps } from '@material-ui/core/Container'
import React from 'react'
import styled from 'styled-components'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { colors, theme } from 'src/styles'
import { FeedAnnouncement } from './FeedAnnouncement'

export const Container = styled.div<ContainerProps>`
  flex: 1;
  padding: ${theme.spacing(3, 2)};
  display: flex;
  border-left: solid 5px transparent;
  &:hover {
    background-color: ${colors.main.greyLight};
  }
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  & > *:not(:first-child) {
    margin-left: ${theme.spacing(1)}px;
  }
`

export default {
  title: 'FeedAnnouncement',
}

export const Base = () => (
  <TransparentWrapper style={{ width: 500 }}>
    <FeedAnnouncement
      action="Je découvre"
      body="Le témoignage quotidien d'une personne SDF qui raconte sa façon de vivre le confinement."
      iconUrl="https://entourage-back-preprod.herokuapp.com/api/v1/announcements/64/icon"
      imageUrl="https://api.entourage.social/assets/announcements/images/64.jpg"
      title="Journal du confinement"
      /* eslint-disable-next-line max-len */
      url="entourage-staging://webview?url=https://api-preprod.entourage.social/api/v1/announcements/64/redirect/e59866c68b39596c23bd4d71a7b03241"
    />
  </TransparentWrapper>
)
