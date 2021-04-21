import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MapIcon from '@material-ui/icons/Map'
import PhoneIcon from '@material-ui/icons/Phone'
import RoomIcon from '@material-ui/icons/Room'
import React from 'react'
import { ContactLink } from 'src/components/ContactLink'
import { texts } from 'src/i18n'
import { colors, variants } from 'src/styles'
import { getUrlFromAddress } from 'src/utils/misc'
import * as S from './POI.styles'

const stopPropagation = (event: React.SyntheticEvent) => event.stopPropagation()

interface POIProps {
  icon?: JSX.Element;
  isActive?: boolean;
  name: string;
  address: string;
  phone: string | null;
}

export function POI(props: POIProps) {
  const {
    icon,
    isActive,
    name,
    address,
    phone,
  } = props

  return (
    <S.Container isActive={isActive}>
      <S.LeftContainer>
        <S.TitleContainer>
          <div>
            {icon}
          </div>
          <Typography align="left" variant={variants.title2}>
            {name}
          </Typography>
        </S.TitleContainer>
        <ContactLink
          disabled={true}
          icon={(
            <Box display="flex" marginLeft={0.5}>
              <RoomIcon
                fontSize="small"
                opacity={0.6}
              />
            </Box>
          )}
          info={address}
          link={getUrlFromAddress(address)}
        />
        {phone && (
          <ContactLink
            color="secondary"
            icon={(
              <Box display="flex" marginLeft={0.5}>
                <PhoneIcon
                  fontSize="small"
                  opacity={0.6}
                />
              </Box>
            )}
            info={phone}
            link={`tel:${phone}`}
          />
        )}

      </S.LeftContainer>
      <Box flexGrow="1" />
      <S.RightContainer>
        <IconButton
          href={getUrlFromAddress(address)}
          onClick={stopPropagation}
          rel="noopener noreferrer"
          target="_blank"
        >
          <S.DirectionsButtonContent>
            <MapIcon style={{ color: colors.main.primary }} />
            <Typography variant={variants.footNote}>
              {texts.content.map.pois.directions}
            </Typography>
          </S.DirectionsButtonContent>
        </IconButton>
      </S.RightContainer>
    </S.Container>
  )
}
