import { SVGProps } from 'react'
import {
  Cat0,
  Cat1,
  Cat2,
  Cat3,
  Cat5,
  Cat7,
  Cat8,
  Cat40,
  Cat41,
  Cat42,
  Cat43,
  Cat6,
  Cat61,
  Cat62,
  Cat63,
} from 'src/assets'
import { POICategory } from 'src/core/api'
import { texts } from 'src/i18n'

export const poiIcons: Record<POICategory, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
  0: Cat0,
  1: Cat1,
  2: Cat2,
  3: Cat3,
  5: Cat5,
  7: Cat7,
  8: Cat8,
  40: Cat40,
  41: Cat41,
  42: Cat42,
  43: Cat43,
  6: Cat6,
  61: Cat61,
  62: Cat62,
  63: Cat63,
}

export const poiLabels: Record<POICategory, string> = {
  0: texts.types.pois.other,
  1: texts.types.pois.eating,
  2: texts.types.pois.sleeping,
  3: texts.types.pois.healing,
  5: texts.types.pois.orientation,
  7: texts.types.pois.reintegration,
  8: texts.types.pois.partners,
  40: texts.types.pois.toilets,
  41: texts.types.pois.fountains,
  42: texts.types.pois.showers,
  43: texts.types.pois.laundries,
  6: texts.types.pois.well_being,
  61: texts.types.pois.clothes,
  62: texts.types.pois.donation_box,
  63: texts.types.pois.cloakroom,
}
