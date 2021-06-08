import React from 'react'
import { MapPOIs } from 'src/containers/MapContainer'
import { POIsMetadata } from 'src/containers/POIsMetadata'
import { StatelessPage } from 'src/utils/types'

interface Props {}

export const POIsPage = () => (
  <>
    <POIsMetadata />
    <MapPOIs />
  </>
)

const POIs: StatelessPage<Props> = () => (
  <POIsPage />
)

export default POIs
