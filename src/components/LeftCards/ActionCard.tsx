import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import { variants } from 'src/styles'
import { DateISO } from 'src/types'

interface Props {
  title: string;
  dateISO: DateISO;
  organizerPictureURL?: string;
  organizerName: string | JSX.Element;
  description: string;
}

export function ActionCard(props: Props) {
  const {
    title,
    dateISO,
    organizerName,
    organizerPictureURL,
    description,
  } = props

  return (
    <Box p={2}>
      <Typography variant={variants.title1}>{title}</Typography>
      <Box>
        <Typography variant={variants.footNote}>
          {organizerName} a créé {'l\'action'} le {new Date(dateISO).toLocaleDateString()}
        </Typography>
      </Box>
      <Box display="flex" marginY={1} alignItems="center" justifyContent="flex-start">
        <Box marginRight={1}>
          <Avatar alt="Organizer" src={organizerPictureURL} />
        </Box>
      </Box>
      <Typography variant={variants.bodyRegular}>{description}</Typography>
    </Box>
  )
}
