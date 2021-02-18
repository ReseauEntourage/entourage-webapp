import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { constants } from 'src/constants'
import { variants } from 'src/styles'
import * as S from './Card.styles'

interface SoliguideCardProps {
  url?: string;
}

export function SoliguideCard(props: SoliguideCardProps) {
  const { url } = props
  return (
    <Box marginBottom={2}>
      <S.SoliguideCard href={url ?? constants.SOLIGUIDE_URL} style={{ textDecoration: 'none' }}>
        <Box marginBottom={1}>
          <img alt="Soliguide" src="/logo-soliguide.png" />
        </Box>
        <Typography align="center" color="textSecondary" variant={variants.bodyBold}>
          Les informations sur ce lieu sont fournies par Soliguide, la cartographie solidaire.
        </Typography>
        <Typography align="center" color="textSecondary">
          Pour des informations encore plus complètes et disponibles en plusieurs langues, cliquez-ici
        </Typography>
      </S.SoliguideCard>
    </Box>
  )
}
