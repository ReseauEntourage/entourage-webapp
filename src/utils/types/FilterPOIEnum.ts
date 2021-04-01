/**
 * POIFilter enums
 */

export const FilterPOICategory = {
  EATING: 'eating',
  SLEEPING: 'sleeping',
  HEALING: 'healing',
  ORIENTATION: 'orientation',
  REINTEGRATION: 'reintegration',
  PARTNERS: 'partners',
  TOILETS: 'toilets',
  FOUNTAINS: 'fountains',
  SHOWERS: 'showers',
  LAUNDRIES: 'laundries',
  WELL_BEING: 'well_being',
  CLOTHES: 'clothes',
  DONATION_BOX: 'donation_box',
  CLOAKROOM: 'cloakroom',
} as const

type FilterPOICategoryKeys = keyof typeof FilterPOICategory
export type FilterPOICategory = typeof FilterPOICategory[FilterPOICategoryKeys]

export const FilterPOIPartner = {
  VOLUNTEERS: 'volunteers',
  DONATIONS: 'donations',
} as const

type FilterPOIPartnerKeys = keyof typeof FilterPOIPartner
export type FilterPOIPartner = typeof FilterPOIPartner[FilterPOIPartnerKeys]
