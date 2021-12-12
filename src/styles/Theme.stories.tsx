import Box from '@material-ui/core/Box'
import TypographyMUI from '@material-ui/core/Typography'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import React from 'react'
import { colors } from './colors'
import { theme } from './theme'

export default {
  title: 'Theme',
}

export const Colors = () => (
  <div>
    <TypographyMUI>
      {Object.entries(colors.main).map(([colorName, colorValue]) => (
        <Box color={colors.main.white} m={1} p={1} style={{ backgroundColor: colorValue }}>
          {colorName} - {colorValue}
        </Box>
      ))}
    </TypographyMUI>
  </div>
)

export const Typography = () => {
  const usedTypo = {
    subtitle1: 'Title 1',
    subtitle2: 'Title 2',
    body1: 'Body Bold',
    body2: 'Body regular',
    h2: 'Header',
    caption: 'Foot Note',
  }

  return (
    (
      <ThemeProvider theme={theme}>
        <div>
          {(Object.entries(usedTypo) as [keyof typeof usedTypo, string][]).map(([name, label]) => {
            const typography = theme.typography[name]
            const content = (
              <TypographyMUI variant={name}>
                <div style={{ display: 'flex' }}>
                  <Box m={1} width={100}>{label}</Box>
                  <Box m={1} width={50}>{typography.fontSize}px</Box>
                  <Box m={1} width={100}>{typography.fontWeight}</Box>
                </div>
              </TypographyMUI>
            )

            return (
              <Box key={name} m={1}>
                {content}
              </Box>
            )
          })}
        </div>
      </ThemeProvider>
    )
  )
}
