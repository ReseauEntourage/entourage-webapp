import { SVGProps } from 'react'
import {
  MatHelp,
  Other,
  Resource,
  Social,
} from 'src/assets'
import { FeedDisplayCategory } from 'src/core/api'

export const feedItemCategoryIcons: Record<FeedDisplayCategory, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
  mat_help: MatHelp,
  other: Other,
  social: Social,
  resource: Resource,
}
