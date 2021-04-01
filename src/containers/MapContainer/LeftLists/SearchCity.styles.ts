import styled from 'styled-components'
import { theme } from 'src/styles'

export const Container = styled.div`
  padding: ${theme.spacing(2, 2)};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex: 1;
`

export const SearchContainer = styled.div`
  align-items: center;
  justify-content: center;
  flex: 1;
`

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${theme.spacing(1)}px;
`
