import React from 'react'
import { useSelector } from 'react-redux'
import { MetaData } from 'src/containers/MetaData'
import { env } from 'src/core/env'
import { selectCurrentPOI } from 'src/core/useCases/pois'
import { texts } from 'src/i18n'

export function POIsMetadata() {
  const currentPoi = useSelector(selectCurrentPOI)

  const title = currentPoi?.name || `${texts.nav.pageTitles.pois} - ${texts.nav.pageTitles.main}`
  const description = currentPoi ? texts.content.map.pois.shareDescription : texts.nav.pageDescriptions.pois
  const url = `${env.SERVER_URL}/pois${currentPoi ? `/${currentPoi.uuid}` : ''}`

  return (
    <MetaData
      description={description}
      title={title}
      url={url}
    />
  )
}
