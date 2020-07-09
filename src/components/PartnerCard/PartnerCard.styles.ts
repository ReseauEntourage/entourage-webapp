import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { variants, theme, devices } from 'src/styles'

export const Avatar = styled.div`
  grid-area: Avatar;
  display: flex;
  justify-content: center;
`

export const Name = styled(Typography).attrs(() => ({
  variant: variants.title1,
  component: 'div',
}))`
  grid-area: Name;
  display: flex;
  justify-content: center;
  margin-bottom: ${theme.spacing(4)}px;
`

export const Description = styled.div`
  grid-area: Description;
  padding: ${theme.spacing(2)}px;
  background-color: #eeeeee;
  margin-bottom: ${theme.spacing(2)}px;
`

export const SectionTitle = styled(Typography).attrs(() => ({
  variant: variants.title1,
  component: 'div',
}))`
`
export const Container = styled(Typography).attrs(() => ({
  variant: variants.bodyRegular,
  component: 'div',
}))`
  display: grid;
  @media ${devices.desktop} {
    grid-template-areas:
        ". Avatar ."
        ". Name ."
        "Description Description Description"
        "DonationsNeeds DonationsNeeds DonationsNeeds"
        "VolunteersNeeds VolunteersNeeds VolunteersNeeds"
        "Phone Mail Website";
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media ${devices.mobile} {
    grid-template-areas:
      "Avatar"
      "Name"
      "Description"
      "DonationsNeeds"
      "VolunteersNeeds"
      "Phone"
      "Mail"
      "Website";
    grid-template-columns: 1fr;
  }
  max-width: 100%;
  margin-bottom: ${theme.spacing(2)}px;
`

export const Phone = styled.div`
  grid-area: Phone;
  @media ${devices.desktop} {
    float: left;
  }

  @media ${devices.mobile} {
    display: flex;
  }
`

export const Website = styled.div`
  grid-area: Website;
  @media ${devices.desktop} {
    float: left;
  }

  @media ${devices.mobile} {
    display: flex;
  }
`

export const Mail = styled.div`
  grid-area: Mail;
  @media ${devices.desktop} {
    float: left;
  }

  @media ${devices.mobile} {
    display: flex;
  }
`

export const DonationsNeeds = styled.div`
  grid-area: DonationsNeeds;
  float: left;
`

export const VolunteersNeeds = styled.div`
  grid-area: VolunteersNeeds;
  float: left;
`
