import { MoreHorizOutlined } from '@material-ui/icons'
import React from 'react'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import * as S from 'src/containers/MapContainer/LeftLists/LeftList.styles'
import { colors } from 'src/styles'
import { FeedEntourage } from './FeedEntourage'

export default {
  title: 'FeedEntourage',
}

export const Base = () => (
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
          <S.Colored category="ask_for_help">Demande</S.Colored>
          &nbsp;de&nbsp;
          <S.Bold>Inès D.</S.Bold>
        </span>
      )}
      title="Goearge recherche un télépone portable"
    />
  </TransparentWrapper>
)

export const Active = () => (
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
          <S.Colored category="ask_for_help">Demande</S.Colored>
          &nbsp;de&nbsp;
          <S.Bold>Inès D.</S.Bold>
        </span>
      )}
      title="Goearge recherche un télépone portable"
    />
  </TransparentWrapper>
)
