import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import { variants } from 'src/styles'

interface Props {
  address: string;
  dateLabel: string;
  description: string;
  isAssociation?: boolean;
  organizerLabel: string | JSX.Element;
  organizerPictureURL?: string;
  title: string;
}

export function EventCard(props: Props) {
  const {
    title,
    dateLabel,
    address,
    organizerLabel,
    organizerPictureURL,
    description,
    isAssociation,
  } = props

  return (
    <Box>
      <Typography variant={variants.title1}>{title}</Typography>
      <Box>
        <Typography variant={variants.footNote}>{dateLabel}</Typography>
      </Box>
      <Box>
        <Typography variant={variants.footNote}>{address}</Typography>
      </Box>
      <Box display="flex" marginY={1} alignItems="center" justifyContent="flex-start">
        <Box marginRight={1}>
          <Avatar alt="Organizer" src={organizerPictureURL} />
        </Box>
        <Typography variant={variants.footNote} color={isAssociation ? 'primary' : undefined}>
          {organizerLabel}
        </Typography>
      </Box>
      <Typography variant={variants.bodyRegular}>{description}</Typography>
    </Box>
  )
}
