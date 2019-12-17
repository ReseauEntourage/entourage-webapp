import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { ThemeProvider } from 'src/styles'

const Container = styled.div`
  margin: 20px;
`

const BtnBar = styled.div`
  border-bottom: solid 1px #ccc;
  display: flex;
  align-items: center;
  border: solid 1px #ccc;
  border-bottom: none;
`

const Content = styled.div`
  background-position: 0 0, 10px 10px;
  background-size: 20px 20px;
  border: solid 1px #ccc;
`

interface TransparentWrapperProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  transparentGB?: boolean;
}

export function TransparentWrapper(props: TransparentWrapperProps) {
  const { children, style, transparentGB: transparentGBProps } = props

  const [transparentGB, setTransparentGB] = useState(transparentGBProps || false)
  const [hasPadding, setHasPadding] = useState(true)

  const onChangeTransparentBG = useCallback(() => {
    setTransparentGB((value) => !value)
  }, [])

  const onChangeNoPadding = useCallback(() => {
    setHasPadding((value) => !value)
  }, [])

  const contentStyle = {
    // eslint-disable-next-line
    backgroundImage: transparentGB ? 'linear-gradient(45deg,#efefef 25%,transparent 0,transparent 75%,#efefef 0,#efefef),linear-gradient(45deg,#efefef 25%,transparent 0,transparent 75%,#efefef 0,#efefef)' : undefined,
    padding: hasPadding ? 10 : 0,
  }

  return (
    <ThemeProvider>
      <Container style={style}>
        <BtnBar>
          <div>
            <Switch
              checked={transparentGB}
              color="primary"
              onChange={onChangeTransparentBG}
            />
            <Typography style={{ marginLeft: 10 }}>
              Background
            </Typography>
          </div>
          <div>
            <Switch
              checked={hasPadding}
              color="primary"
              onChange={onChangeNoPadding}
            />
            <Typography style={{ marginLeft: 10 }}>
              Padding
            </Typography>
          </div>
        </BtnBar>
        <Content style={contentStyle}>
          {children}
        </Content>
      </Container>
    </ThemeProvider>
  )
}
