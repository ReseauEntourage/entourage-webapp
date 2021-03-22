import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { variants, theme } from 'src/styles'

export const SectionContainer = styled.div`
  padding-left: ${theme.spacing(2)}px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr 1fr 1fr;
  grid-gap: ${theme.spacing(0, 2)};
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

export const Icon = styled.div<ElementProps & { color: string; }>`
  grid-area: icon;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ index, color }) => `
    grid-row: ${index + 1} / ${index + 2};
    color: ${color}
  `}
`

export const Label = styled(Typography)<ElementProps>`
  grid-area: label;
  display: flex;
  align-items: center;
  ${({ index }) => `
    grid-row: ${index + 1} / ${index + 2};
  `}
`

export const Switch = styled.div<ElementProps>`
  grid-area: switch;
  align-items: center;
  justify-content: center;
  ${({ index }) => `
    grid-row: ${index + 1} / ${index + 2};
  `}
`

export const Title = styled(Typography).attrs(() => ({
  variant: variants.title2,
}))`
  grid-area: title;
  display: flex;
  align-items: center;
`

