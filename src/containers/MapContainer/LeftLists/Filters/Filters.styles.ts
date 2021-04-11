import Typography from '@material-ui/core/Typography'
import FilterListIconMUI from '@material-ui/icons/FilterList'
import styled from 'styled-components'
import { variants, theme, colors } from 'src/styles'

export const SectionContainer = styled.div`
  padding-left: ${theme.spacing(2)}px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  // grid-template-rows: 1fr 1fr 1fr;
  grid-gap: ${theme.spacing(0, 2)};
  grid-template-areas:
    'x title switch'
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

export const SectionTitle = styled(Typography).attrs(() => ({
  variant: variants.title2,
}))`
  padding: ${theme.spacing(1, 0)};
  grid-area: title;
  display: flex;
  align-items: center;
`

export const MenuContainer = styled.div`
  a {
    text-decoration: none !important;
  }
`

export const FilterListButton = styled.div`
    outline: none;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: ${theme.spacing(2, 0, 2, 0)};
`

export const FilterListIcon = styled(FilterListIconMUI)`
    color: white;
    background-color: ${colors.main.primary};
    padding: 2px;
    border-radius: 14px;
`

export const Title = styled(Typography).attrs(() => ({
  variant: variants.bodyRegular,
}))`
    padding: ${theme.spacing(1, 0)};
    background-color: ${colors.main.greyLight};
    display: flex;
    justify-content: center;
  `

export const Circle = styled.div<{isActive: boolean; }>`
  height: 60px;
  line-height: 60px;  
  width: 60px;  
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
  ${({ isActive }) => `
    border: 1px solid ${isActive ? colors.main.primary : colors.main.grey};
    color: ${isActive ? colors.main.primary : colors.main.grey};
    &:hover {
      box-shadow: 0 0 0 7px ${colors.borderColor}; 
    }
  `}
`

export const CircleContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding:  ${theme.spacing(1)}px;
`
