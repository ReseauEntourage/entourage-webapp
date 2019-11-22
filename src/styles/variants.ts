import { TypographyProps } from '@material-ui/core/Typography'

type VariantKey =
  | 'title1'
  | 'title2'
  | 'bodyBold'
  | 'bodyRegular'
  | 'header'
  | 'footNote'

type Variants = {
  [key in VariantKey]: TypographyProps['variant'];
}

export const variants: Variants = {
  title1: 'subtitle1',
  title2: 'subtitle2',
  bodyBold: 'body1',
  bodyRegular: 'body2',
  header: 'h2',
  footNote: 'caption',
}
