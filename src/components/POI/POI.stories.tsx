import React from 'react'
import { POIIcon } from '../Map'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { POI } from './POI'

export default {
  title: 'POI',
}

export const Base = () => (
  <TransparentWrapper style={{ width: 500 }}>
    <POI
      address="Paroisse Saint Vincent de Paul, 92110 Clichy"
      icon={<POIIcon poiCategory={63} />}
      name="Bagagerie solidaire de Clichy"
      phone="0102030405"
    />
  </TransparentWrapper>
)

export const Active = () => (
  <TransparentWrapper style={{ width: 500 }}>
    <POI
      address="Paroisse Saint Vincent de Paul, 92110 Clichy"
      icon={<POIIcon poiCategory={63} />}
      isActive={true}
      name="Bagagerie solidaire de Clichy"
      phone="0102030405"
    />
  </TransparentWrapper>
)
