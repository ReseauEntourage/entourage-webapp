import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { Avatar } from 'src/components/Avatar'
import { variants } from 'src/styles'

interface EventCardProps {
  actions: JSX.Element;
  address: string;
  dateLabel: string;
  description: string;
  isAssociation?: boolean;
  organizerLabel: string | JSX.Element;
  organizerPictureURL?: string;
  title: string;
}

export function EventCard(props: EventCardProps) {
  const {
    actions,
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
      <Box alignItems="center" display="flex" justifyContent="flex-start" marginY={1}>
        <Box marginRight={1}>
          <Avatar alt="Organizer" src={organizerPictureURL} />
        </Box>
        <Typography color={isAssociation ? 'primary' : undefined} variant={variants.footNote}>
          {organizerLabel}
        </Typography>
      </Box>
      <Box marginY={2}>
        {actions}
      </Box>
      <Typography variant={variants.bodyRegular}>{description}</Typography>
    </Box>
  )
}
