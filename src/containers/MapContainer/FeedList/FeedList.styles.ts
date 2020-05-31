import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import { devices } from 'src/styles'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  @media ${devices.mobile} {
    width: 100%;
  }
`

export const SearchContainer = styled.div`
  flex: 0;
`

export const FeedContainer = styled(Box)`
  flex: 1;
  overflow: hidden;
  position: relative;
  @media ${devices.mobile} {
    width: 100%;
  }
`
export const Scroll = styled.div`
  position: relative;
  height: 100%;
  overflow: auto;
`
