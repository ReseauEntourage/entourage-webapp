import React from 'react'
import { colors } from 'src/styles'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import { theme } from 'src/styles/theme'
import { EventCard } from './EventCard'
import { ActionCard } from './ActionCard'

export default {
  title: 'LeftCards',
}

function Wrapper(props: { children: React.ReactChild | React.ReactChild[]; }) {
  const { children } = props
  return (
    <ThemeProvider theme={theme}>
      <div style={{ border: `solid 1px ${colors.borderColor}`, maxWidth: 600, margin: 20 }}>
        {children}
      </div>
    </ThemeProvider>
  )
}

export const Action = () => (
  <>
    <Wrapper>
      <ActionCard
        title="Je donne un manteau, des pulls et jeans."
        organizerLabel={<div>Contribution par <b>Aurore</b></div>}
        dateLabel="Crée il y a 10 jours - Actif il y a 9 jours"
        organizerPictureURL="https://i.pravatar.cc/100"
        description={`
          Je donne quelques vêtements en très bon état
          pour fille ado ou femme : une parka à capuche 14 ans,
          des pulls XS, des jeans 12-14 ans.Paris 12ème
        `}
      />
    </Wrapper>
    <Wrapper>
      <ActionCard
        title="Je donne un manteau, des pulls et jeans."
        organizerLabel={<div>Contribution par <b>Aurore</b></div>}
        dateLabel="Crée il y a 10 jours - Actif il y a 9 jours"
        organizerPictureURL="https://i.pravatar.cc/100"
        description={`
          Je donne quelques vêtements en très bon état
          pour fille ado ou femme : une parka à capuche 14 ans,
          des pulls XS, des jeans 12-14 ans.Paris 12ème
        `}
        isAssociation={true}
      />
    </Wrapper>
  </>
)

export const Event = () => (
  <>
    <Wrapper>
      <EventCard
        title="Vernissage au CHRS Parmentier"
        dateLabel="Jeudi 12 décembre à de 17h"
        address="35 avenue  des Batignolles 75017 Paris"
        organizerPictureURL="https://i.pravatar.cc/100"
        organizerLabel={<div>Organisé par <b>Aurore</b></div>}
        description={`
          Les personnes hébergées au CHRS comptent parmi elles des artistes qui ont pu réaliser cette année des œuvres.
          Nous vous invitons à les découvrir lors d’un vernissage convivial.
        `}
      />
    </Wrapper>
    <Wrapper>
      <EventCard
        title="Vernissage au CHRS Parmentier"
        dateLabel="Jeudi 12 décembre à de 17h"
        address="35 avenue  des Batignolles 75017 Paris"
        organizerPictureURL="https://i.pravatar.cc/100"
        organizerLabel={<div>Organisé par <b>Association Aurore</b></div>}
        description={`
          Les personnes hébergées au CHRS comptent parmi elles des artistes qui ont pu réaliser cette année des œuvres.
          Nous vous invitons à les découvrir lors d’un vernissage convivial.
        `}
        isAssociation={true}
      />
    </Wrapper>
  </>
)
