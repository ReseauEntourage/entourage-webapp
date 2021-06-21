import { Box } from '@material-ui/core'
import styled from 'styled-components'
import { FeedEntourageType } from 'src/core/api'
import { devices, colors } from 'src/styles'
import { FeedEntourageTypeColors } from 'src/utils/types'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  @media ${devices.mobile} {
    width: 100%;
  }
`

export const SearchContainer = styled.div`
  flex: 0;
  display: flex;
`

export const ListContainer = styled(Box)`
  flex: 1;
  overflow: hidden;
  position: relative;
  @media ${devices.mobile} {
    width: 100%;
  }
`

export const ListItem = styled.div`
  border-bottom: 1px ${colors.borderColor} solid;
  display: flex;
`

export const Scroll = styled.div`
  position: relative;
  height: 100%;
  overflow: auto;
`

export const Colored = styled.span<{ category: FeedEntourageType; }>`
  color: ${((props) => FeedEntourageTypeColors[props.category])}
`

export const Bold = styled.span`
  font-weight: bold;
`
