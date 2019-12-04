import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import { variants } from 'src/styles'

interface Props {
  dateLabel: string | JSX.Element;
  description: string;
  isAssociation?: boolean;
  organizerLabel: string | JSX.Element;
  organizerPictureURL?: string;
  title: string;
}

export function ActionCard(props: Props) {
  const {
    title,
    dateLabel,
    organizerLabel,
    organizerPictureURL,
    description,
    isAssociation,
  } = props

  return (
    <Box>
      <Typography variant={variants.title1}>{title}</Typography>
      <Box display="flex" marginY={1} alignItems="center" justifyContent="flex-start">
        <Box marginRight={1}>
          <Avatar alt="Organizer" src={organizerPictureURL} />
        </Box>
        <Box>
          <Typography variant={variants.footNote} color={isAssociation ? 'primary' : undefined}>
            {organizerLabel}
          </Typography>
        </Box>
      </Box>
      <Typography variant={variants.bodyRegular}>{description}</Typography>
      <Box marginY={1}>
        <Typography variant={variants.footNote}>
          {dateLabel}
        </Typography>
      </Box>
    </Box>
  )
}
