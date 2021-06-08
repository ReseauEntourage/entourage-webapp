import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { Link } from 'src/components/Link'
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
      <Link href={url ?? constants.SOLIGUIDE_URL} target="_blank">
        <S.SoliguideCard>
          <Box marginBottom={2}>
            <S.SoliguideLogo alt="Soliguide" src="/logo-soliguide.png" />
          </Box>
          <Typography align="center" color="textPrimary">
            <Typography display="inline" variant={variants.bodyRegular}>
              Les informations sur ce lieu sont fournies par{' '}
            </Typography>
            <Typography display="inline" variant={variants.bodyBold}>
              Soliguide, la cartographie solidaire.
            </Typography>
          </Typography>
          <Typography align="center" color="textPrimary">
            <Typography display="inline" variant={variants.bodyRegular}>
              Pour des informations encore plus complètes et disponibles en plusieurs langues,{' '}
            </Typography>
            <Typography display="inline" noWrap={true} variant={variants.bodyBold}>
              cliquez-ici.
            </Typography>
          </Typography>

        </S.SoliguideCard>
      </Link>

    </Box>
  )
}
