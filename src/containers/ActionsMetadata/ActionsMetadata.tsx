import React from 'react'
import { useSelector } from 'react-redux'
import { MetaData } from 'src/containers/MetaData'
import { env } from 'src/core/env'
import { selectCurrentFeedItem } from 'src/core/useCases/feed'
import { texts } from 'src/i18n'

export function ActionsMetadata() {
  const currentFeedItem = useSelector(selectCurrentFeedItem)

  if (currentFeedItem && currentFeedItem.itemType === 'Entourage') {
    const { author, title, description, entourageType, groupType } = currentFeedItem
    const { partner } = author
    const organizerName = partner ? partner.name : author.displayName

    const pronoun = partner ? texts.content.map.actions.shareTitles.their : texts.content.map.actions.shareTitles.his

    let shareTitle
    if (groupType === 'outing') {
      shareTitle = `${texts.content.map.actions.shareTitles.participate} ${organizerName}`
    } else if (groupType === 'action') {
      shareTitle = entourageType === 'contribution'
        ? `${texts.content.map.actions.shareTitles.help} ${organizerName}`
        + ` ${texts.content.map.actions.shareTitles.realize} ${pronoun} ${texts.content.map.actions.shareTitles.action}`
        : `${texts.content.map.actions.shareTitles.comeToHelp} ${organizerName}`
    }

    const url = `${env.SERVER_URL}/actions${currentFeedItem ? `/${currentFeedItem.uuid}` : ''}`

    return (
      <MetaData
        description={`${title}. ${description}`}
        title={shareTitle}
        url={url}
      />
    )
  }

  return (
    <MetaData
      description={texts.nav.pageDescriptions.actions}
      title={`${texts.nav.pageTitles.actions} - ${texts.nav.pageTitles.main}`}
      url={`${env.SERVER_URL}/actions`}
    />
  )
}
