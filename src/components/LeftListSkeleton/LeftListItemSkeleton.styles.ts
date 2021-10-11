import styled from 'styled-components'
import { theme } from 'src/styles'

export const Container = styled.div`
  flex: 1;
  padding: ${theme.spacing(3, 2)};
  display: flex;
  align-items: center;
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  & > *:not(:first-child) {
    margin-left: ${theme.spacing(1)}px;
  }
`
