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

interface OrganizationDetailProps { clickable: boolean;}

export const OrganizationDetail = styled.div<OrganizationDetailProps>`
  display: flex;
  align-items: center;
  & > *:first-child {
    margin-right: ${theme.spacing(2)}px;
  }
  ${({ clickable }) => clickable && `
    cursor: pointer;
`}
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
