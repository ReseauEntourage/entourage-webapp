import { styled as materialStyled } from '@material-ui/core/styles'
import styled from 'styled-components'
import { colors } from 'src/styles'

export const Container = materialStyled('div')(({ theme }) => ({
  margin: theme.spacing(2),
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
}))

export const Label = materialStyled('div')(({ theme }) => ({
  marginLeft: theme.spacing(1),
}))

export const ActiveContainer = styled.div<{ isActive?: boolean; }>`
  color: ${(props) => props.isActive && colors.main.primary};
  font-weight: ${(props) => props.isActive && 'bold'};
  display: flex;
  align-items: center;
`
