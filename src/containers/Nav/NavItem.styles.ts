import { styled } from '@material-ui/core/styles'

export const Container = styled('div')(({ theme }) => ({
  margin: theme.spacing(2),
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
}))

export const Label = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(1),
}))

export const InternalLink = styled('a')(() => ({
  textDecoration: 'none',
}))
