import Box from '@material-ui/core/Box'
import React from 'react'
import { Button } from 'src/components/Button'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { ActionCard } from './ActionCard'
import { EventCard } from './EventCard'
import { POICard } from './POICard'

export default {
  title: 'RightCards',
}

function Wrapper(props: { children: JSX.Element; }) {
  const { children } = props
  return (
    <TransparentWrapper style={{ maxWidth: 600 }}>
      {children}
    </TransparentWrapper>
  )
}

export function Action() {
  return (
    <>
      <Wrapper>
        <ActionCard
          actions={(
            <Box display="flex" justifyContent="space-around" marginX={4} marginY={2}>
              <Button>
                Participer
              </Button>
              <Button color="secondary">
                Partager
              </Button>
              <Button color="secondary">
                Signaler
              </Button>
            </Box>
          )}
          dateLabel="Crée il y a 10 jours - Actif il y a 9 jours"
          description={`
          Je donne quelques vêtements en très bon état
          pour fille ado ou femme : une parka à capuche 14 ans,
          des pulls XS, des jeans 12-14 ans.Paris 12ème
        `}
          organizerLabel={<div>Contribution par <b>Aurore</b></div>}
          organizerPictureURL="https://i.pravatar.cc/100"
          title="Je donne un manteau, des pulls et jeans."
        />
      </Wrapper>
      <Wrapper>
        <ActionCard
          actions={(
            <Box display="flex" justifyContent="space-around" marginX={4} marginY={2}>
              <Button>
                Participer
              </Button>
              <Button color="secondary">
                Partager
              </Button>
              <Button color="secondary">
                Signaler
              </Button>
            </Box>
          )}
          dateLabel="Crée il y a 10 jours - Actif il y a 9 jours"
          description={`
          Je donne quelques vêtements en très bon état
          pour fille ado ou femme : une parka à capuche 14 ans,
          des pulls XS, des jeans 12-14 ans.Paris 12ème
        `}
          isAssociation={true}
          organizerLabel={<div>Contribution par <b>Aurore</b></div>}
          organizerPictureURL="https://i.pravatar.cc/100"
          title="Je donne un manteau, des pulls et jeans."
        />
      </Wrapper>
    </>
  )
}

export function Event() {
  return (
    <>
      <Wrapper>
        <EventCard
          actions={(
            <Box display="flex" justifyContent="space-around" marginX={4} marginY={2}>
              <Button>
                Participer
              </Button>
              <Button color="secondary">
                Partager
              </Button>
              <Button color="secondary">
                Signaler
              </Button>
            </Box>
          )}
          address="35 avenue  des Batignolles 75017 Paris"
          dateLabel="Jeudi 12 décembre à de 17h"
          description={`
          Les personnes hébergées au CHRS comptent parmi elles des artistes qui ont pu réaliser cette année des œuvres.
          Nous vous invitons à les découvrir lors d’un vernissage convivial.
        `}
          organizerLabel={<div>Organisé par <b>Aurore</b></div>}
          organizerPictureURL="https://i.pravatar.cc/100"
          title="Vernissage au CHRS Parmentier"
        />
      </Wrapper>
      <Wrapper>
        <EventCard
          actions={(
            <Box display="flex" justifyContent="space-around" marginX={4} marginY={2}>
              <Button>
                Participer
              </Button>
              <Button color="secondary">
                Partager
              </Button>
              <Button color="secondary">
                Signaler
              </Button>
            </Box>
          )}
          address="35 avenue  des Batignolles 75017 Paris"
          dateLabel="Jeudi 12 décembre à de 17h"
          description={`
          Les personnes hébergées au CHRS comptent parmi elles des artistes qui ont pu réaliser cette année des œuvres.
          Nous vous invitons à les découvrir lors d’un vernissage convivial.
        `}
          isAssociation={true}
          organizerLabel={<div>Organisé par <b>Association Aurore</b></div>}
          organizerPictureURL="https://i.pravatar.cc/100"
          title="Vernissage au CHRS Parmentier"
        />
      </Wrapper>
    </>
  )
}

export function POI() {
  return (
    <Wrapper>
      <POICard
        address="Paroisse Saint Vincent de Paul, 92110 Clichy"
        audience="Femmes sans domicile fixe, sur inscription auprès des associations partenaires"
        categoryIds={[1, 2, 63]}
        description="La bagagerie, c’est une équipe et un lieu permettant à 15 femmes sans domicile
         fixe de déposer leurs sacs et leurs bagages en toute sécurité et d’y accéder,
         matin et soir, tous les jours de l’année. Des bénévoles s’y relaient pour assurer les permanences :
         - Lundi, mardi, jeudi et vendredi, de 7h15 à 9h15 et de 20h à 22h.
         - Mercredi, samedi et dimanche de 7h à 9h et de 20h à 22h.
         Les usagers, envoyés par une association partenaire de la Bagagerie,
         y trouveront un accueil amical et un casier personnel,
         ainsi que divers équipements (cabine individuelle pour se changer, sanitaires, accès à internet…).
         La bagagerie est située dans les locaux de la paroisse Saint-Vincent de Paul, accès par la rue Dagobert."
        email="bagagerieclichy@gmail.com"
        hours="9h-12h et 14h-18h"
        languages="Français et Anglais"
        name="Bagagerie solidaire de Clichy"
        phone="0102030405"
        source="entourage"
        website="www.bagageriessolidaires92.org"
      />
    </Wrapper>
  )
}

export function POISoliguide() {
  return (
    <Wrapper>
      <POICard
        address="Paroisse Saint Vincent de Paul, 92110 Clichy"
        audience="Femmes sans domicile fixe, sur inscription auprès des associations partenaires"
        categoryIds={[1, 2, 63]}
        description="La bagagerie, c’est une équipe et un lieu permettant à 15 femmes sans domicile
         fixe de déposer leurs sacs et leurs bagages en toute sécurité et d’y accéder,
         matin et soir, tous les jours de l’année. Des bénévoles s’y relaient pour assurer les permanences :
         - Lundi, mardi, jeudi et vendredi, de 7h15 à 9h15 et de 20h à 22h.
         - Mercredi, samedi et dimanche de 7h à 9h et de 20h à 22h.
         Les usagers, envoyés par une association partenaire de la Bagagerie,
         y trouveront un accueil amical et un casier personnel,
         ainsi que divers équipements (cabine individuelle pour se changer, sanitaires, accès à internet…).
         La bagagerie est située dans les locaux de la paroisse Saint-Vincent de Paul, accès par la rue Dagobert."
        email="bagagerieclichy@gmail.com"
        hours="9h-12h et 14h-18h"
        languages="Français et Anglais"
        name="Bagagerie solidaire de Clichy"
        phone="0102030405"
        source="soliguide"
        sourceUrl="https://soliguide.fr/fiche/repas-chauds-la-chorba-paris-centre-10680"
        website="www.bagageriessolidaires92.org"
      />
    </Wrapper>
  )
}
