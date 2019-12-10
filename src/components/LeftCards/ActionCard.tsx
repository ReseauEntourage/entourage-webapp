import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import React from 'react'
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
      <Box alignItems="center" display="flex" justifyContent="flex-start" marginY={1}>
        <Box marginRight={1}>
          <Avatar alt="Organizer" src={organizerPictureURL} />
        </Box>
        <Box>
          <Typography color={isAssociation ? 'primary' : undefined} variant={variants.footNote}>
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
