/**
 * POIFilter enums
 */

export const FilterPOICategory = {
  OTHER: 'OTHER',
  EATING: 'EATING',
  SLEEPING: 'SLEEPING',
  HEALING: 'HEALING',
  ORIENTATION: 'ORIENTATION',
  REINTEGRATION: 'REINTEGRATION',
  PARTNERS: 'PARTNERS',
  TOILETS: 'TOILETS',
  FOUNTAINS: 'FOUNTAINS',
  SHOWERS: 'SHOWERS',
  LAUNDRIES: 'LAUNDRIES',
  WELL_BEING: 'WELL_BEING',
  CLOTHES: 'CLOTHES',
  DONATION_BOX: 'DONATION_BOX',
  CLOAKROOM: 'CLOAKROOM',
} as const

export type FilterPOICategory = keyof typeof FilterPOICategory

export const FilterPOIPartner = {
  VOLUNTEERS: 'VOLUNTEERS',
  DONATIONS: 'DONATIONS',
} as const

export type FilterPOIPartner = keyof typeof FilterPOIPartner
