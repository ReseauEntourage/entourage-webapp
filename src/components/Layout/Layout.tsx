import React from 'react'
import { styled } from '@material-ui/core/styles'

const Main = styled('div')({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
})

const Nav = styled('div')({
  flex: 0,
})

const Page = styled('div')({
  flex: 1,
})

export class Layout extends React.PureComponent<{children: JSX.Element;}> {
  static Nav = Nav

  static Page = Page

  render() {
    const { children } = this.props
    return <Main>{children}</Main>
  }
}
