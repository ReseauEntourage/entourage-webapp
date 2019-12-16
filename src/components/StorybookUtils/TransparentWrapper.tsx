import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { ThemeProvider } from 'src/styles'

const Container = styled.div`
  border: solid 1px #ccc;
  margin: 20px;
`

const BtnBar = styled.div`
  border-bottom: solid 1px #ccc;
  display: flex;
  align-items: center;
`

const Content = styled.div`
  background-position: 0 0, 10px 10px;
  background-size: 20px 20px;
  padding: 10px;
`

interface TransparentWrapperProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function TransparentWrapper(props: TransparentWrapperProps) {
  const { children, style } = props

  const [transparentGB, setTransparentGB] = useState(false)

  const onChangeTransparentBG = useCallback(() => {
    setTransparentGB((value) => !value)
  }, [])

  const contentStyle = {
    // eslint-disable-next-line
    backgroundImage: transparentGB ? 'linear-gradient(45deg,#efefef 25%,transparent 0,transparent 75%,#efefef 0,#efefef),linear-gradient(45deg,#efefef 25%,transparent 0,transparent 75%,#efefef 0,#efefef)' : undefined,
  }

  return (
    <ThemeProvider>
      <Container style={style}>
        <BtnBar>
          <Switch
            checked={transparentGB}
            color="primary"
            onChange={onChangeTransparentBG}
            value="checked"
          />
          <Typography style={{ marginLeft: 10 }}>
            Transparent background
          </Typography>
        </BtnBar>
        <Content style={contentStyle}>
          {children}
        </Content>
      </Container>
    </ThemeProvider>
  )
}
