import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { variants, theme, devices } from 'src/styles'

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
    "Actions . Organization"
    "ReportBtn . ContactBtn";
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media ${devices.mobile} {
    grid-template-areas:
      "Avatar Avatar"
      "Name Name"
      "Description Description"
      "Actions Organization"
      "ReportBtn ContactBtn";
    grid-template-columns: 1fr 1fr;
  }
  max-width: 100%;
  margin-bottom: ${theme.spacing(2)}px;
`

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

export const Actions = styled.div`
  grid-area: Actions;
`

export const Organization = styled.div`
  grid-area: Organization;
`

export const OrganizationDetail = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  & > *:first-child {
    margin-right: ${theme.spacing(2)}px;
  }
`

export const SectionTitle = styled(Typography).attrs(() => ({
  variant: variants.title1,
  component: 'div',
}))`
`

export const ContactBtn = styled.div`
  grid-area: ContactBtn;
  display: flex;
  justify-content: flex-end;
  margin-top: ${theme.spacing(2)}px;
`

export const ReportBtn = styled.div`
  grid-area: ReportBtn;
  margin-top: ${theme.spacing(2)}px;
`

export const PartnerContainer = styled(Typography).attrs(() => ({
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

export const PhoneArea = styled.div`
  grid-area: Phone;
  @media ${devices.desktop} {
    display: grid;
  }
  @media ${devices.mobile} {
    display: flex;
  }
`

export const WebsiteArea = styled.div`
  grid-area: Website;
  @media ${devices.desktop} {
    display: grid;
  }

  @media ${devices.mobile} {
    display: flex;
  }
`

export const MailArea = styled.div`
  grid-area: Mail;
  @media ${devices.desktop} {
    display: grid;
  }

  @media ${devices.mobile} {
    display: flex;
  }
`

export const DonationsNeeds = styled.div`
  grid-area: DonationsNeeds;
  display: grid;
`

export const VolunteersNeeds = styled.div`
  grid-area: VolunteersNeeds;
  display: grid;
`
