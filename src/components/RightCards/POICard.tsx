import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import EmailIcon from '@material-ui/icons/Email'
import LinkIcon from '@material-ui/icons/Link'
import PhoneIcon from '@material-ui/icons/Phone'
import RoomIcon from '@material-ui/icons/Room'
import Linkify from 'linkifyjs/react'
import React from 'react'
import { POICategory, POISource } from '../../core/api'
import { POIIcon } from '../Map'
import { ContactLink } from 'src/components/ContactLink'
import { constants } from 'src/constants'
import { texts } from 'src/i18n'
import { variants } from 'src/styles'
import * as S from './Card.styles'

interface SoliguideCardProps {
  url?: string;
}

function SoliguideCard(props: SoliguideCardProps) {
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

interface POICardProps {
  name: string;
  address: string;
  phone: string | null;
  description: string | null;
  categoryIds: POICategory['id'][];
  partnerId?: string | null;
  website: string | null;
  email: string | null;
  hours: string | null;
  languages: string | null;
  audience: string | null;
  source: POISource;
  sourceUrl?: string | null;
}

export function POICard(props: POICardProps) {
  const {
    name,
    address,
    phone,
    description,
    categoryIds,
    // partnerId,
    website,
    email,
    hours,
    languages,
    audience,
    source,
    sourceUrl,
  } = props

  const googleMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURI(address)}`

  return (
    <Box>
      {source === 'soliguide' && sourceUrl && (
        <SoliguideCard url={sourceUrl} />
      )}
      <Typography variant={variants.title1}>{name}</Typography>
      <S.Container>
        <Box alignItems="center" display="flex" justifyContent="flex-start" marginY={1}>
          <S.HorizontalContainer>
            {
              categoryIds.map((categoryId) => {
                return (
                  <Box key={categoryId} display="flex" marginRight={1}>
                    <POIIcon poiCategory={categoryId} size={32} />
                  </Box>
                )
              })
            }
          </S.HorizontalContainer>
        </Box>
        <Box marginY={1}>
          <Linkify>
            <S.Description>{description}</S.Description>
          </Linkify>
        </Box>
        <Box marginY={1}>
          <S.Container>
            {
              hours
                && (
                  <S.Section>
                    <Typography variant={variants.title2}>{texts.content.map.pois.hours}</Typography>
                    <Typography variant={variants.bodyRegular}>
                      {hours}
                    </Typography>
                  </S.Section>
                )
            }
            {
              audience
                && (
                  <S.Section>
                    <Typography variant={variants.title2}>{texts.content.map.pois.audience}</Typography>
                    <Typography variant={variants.bodyRegular}>
                      {audience}
                    </Typography>
                  </S.Section>
                )
            }
            {
              languages
                && (
                  <S.Section>
                    <Typography variant={variants.title2}>{texts.content.map.pois.languages}</Typography>
                    <Typography variant={variants.bodyRegular}>
                      {languages}
                    </Typography>
                  </S.Section>
                )
            }

          </S.Container>
        </Box>
        <Box marginY={1}>
          <Typography variant={variants.title2}>{texts.content.map.pois.contact}</Typography>
          {
            phone
            && (
              <ContactLink
                color="primary"
                icon={<PhoneIcon />}
                info={phone}
                link={`tel:${phone}`}
              />
            )
          }
          {
            email
              && (
                <ContactLink
                  color="primary"
                  icon={<EmailIcon />}
                  info={email}
                  link={`mailto:${email}`}
                />
              )
          }
          {
            website
            && (
              <ContactLink
                color="primary"
                icon={<LinkIcon />}
                info={website}
                link={website}
              />

            )
          }
          {
            address
            && (
              <ContactLink
                color="primary"
                icon={<RoomIcon />}
                info={address}
                link={googleMapLink}
              />
            )
          }
        </Box>
      </S.Container>
    </Box>
  )
}
