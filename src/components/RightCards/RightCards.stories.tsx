import Box from '@material-ui/core/Box'
import React from 'react'
import { Button } from 'src/components/Button'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { ActionCard } from './ActionCard'
import { EventCard } from './EventCard'

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

export const Action = () => (
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

export const Event = () => (
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
