import SvgIcon from '@material-ui/core/SvgIcon'
import styled from 'styled-components'
import { colors, theme } from 'src/styles'

interface ContainerProps {
  isActive?: boolean;
}

export const Container = styled.div<ContainerProps>`
  flex: 1;
  padding: ${theme.spacing(3, 2)};
  display: flex;
  align-items: center;
  border-left: solid 5px transparent;
  border-left-color: ${({ isActive }) => isActive && colors.main.primary};
  &:hover {
    background-color: ${colors.main.greyLight};
  }
`

export const NumberContainer = styled.div`
  color: ${colors.main.greyishBrown};
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  margin-bottom: ${theme.spacing(0.5)}px;
`

export const NumberIcon = styled(SvgIcon)`
  margin-right: ${theme.spacing(0.5)}px;
  font-size: 18px;
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  & > *:not(:first-child) {
    margin-left: ${theme.spacing(1)}px;
  }
`
