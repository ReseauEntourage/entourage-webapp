import styled from 'styled-components'
import { theme } from 'src/styles'

export const Container = styled.div`
  display: flex;
  margin: ${theme.spacing(1)}px 0 ${theme.spacing(1)}px ${theme.spacing(1)}px;

  & > *:first-child {
    margin-right: ${theme.spacing(1)}px;
    flex: 1;
  }

  & > *:nth-child(2) {
    flex: 0;
  }
`
