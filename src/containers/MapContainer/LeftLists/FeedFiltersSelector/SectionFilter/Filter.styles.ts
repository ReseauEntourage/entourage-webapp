import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { variants, theme } from 'src/styles'

export const SectionContainer = styled.div`
  padding-left: ${theme.spacing(1)}px;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: ${theme.spacing(0, 1)};
  grid-template-areas:
    'title title switch'
    'icon label switch'
    'icon label switch'
    'icon label switch'
    'icon label switch';
  align-items: center;
  // justify-items: center;
`

interface ElementProps {
  index: number;
}

export const Icon = styled.div<ElementProps>`
  grid-area: icon;
  ${({ index }) => `
    grid-row: ${index + 1} / ${index + 2};
  `}
`

export const Label = styled.div<ElementProps>`
  grid-area: label;
  ${({ index }) => `
    grid-row: ${index + 1} / ${index + 2};
  `}
`

export const Switch = styled.div<ElementProps>`
  grid-area: switch;
  ${({ index }) => `
    grid-row: ${index + 1} / ${index + 2};
  `}
`

export const Title = styled(Typography).attrs(() => ({
  variant: variants.title2,
}))`
  grid-area: title;
`

