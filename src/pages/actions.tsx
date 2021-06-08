import React from 'react'
import { ActionsMetadata } from 'src/containers/ActionsMetadata'
import { MapActions } from 'src/containers/MapContainer'
import { StatelessPage } from 'src/utils/types'

interface Props {}

export const ActionsPage = () => (
  <>
    <ActionsMetadata />
    <MapActions />
  </>
)

const Actions: StatelessPage<Props> = () => (
  <ActionsPage />
)

export default Actions
