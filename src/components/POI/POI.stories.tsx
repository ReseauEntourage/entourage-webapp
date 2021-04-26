import { LocalHospital } from '@material-ui/icons'
import React from 'react'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { colors } from 'src/styles'
import { POI } from './POI'

export default {
  title: 'POI',
}

// Can't use POIIcon component because Storybook can't seem to import SVG files
const Icon = () => (
  <div
    style={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 22,
      width: 22,
      borderRadius: '50%',
      backgroundColor: colors.pois['3'],
      cursor: 'pointer',
    }}
  >
    <LocalHospital
      style={{
        color: colors.main.white,
        fontSize: 16,
      }}
    />
  </div>
)

export const Base = () => (
  <TransparentWrapper style={{ width: 500 }}>
    <POI
      address="Paroisse Saint Vincent de Paul, 92110 Clichy"
      icon={<Icon />}
      name="Bagagerie solidaire de Clichy"
      phone="0102030405"
    />
  </TransparentWrapper>
)

export const Active = () => (
  <TransparentWrapper style={{ width: 500 }}>
    <POI
      address="Paroisse Saint Vincent de Paul, 92110 Clichy"
      icon={<Icon />}
      isActive={true}
      name="Bagagerie solidaire de Clichy"
      phone="0102030405"
    />
  </TransparentWrapper>
)
