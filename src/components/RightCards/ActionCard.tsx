import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { Avatar } from 'src/components/Avatar'
import { variants } from 'src/styles'

interface ActionCardProps {
  actions: JSX.Element;
  dateLabel: string | JSX.Element;
  description: string;
  isAssociation?: boolean;
  onClickAvatar?: React.ComponentProps<typeof Avatar>['onClick'];
  organizerLabel: string | JSX.Element;
  organizerPictureURL?: string;
  title: string;
}

export function ActionCard(props: ActionCardProps) {
  const {
    actions,
    title,
    dateLabel,
    organizerLabel,
    organizerPictureURL,
    description,
    isAssociation,
    onClickAvatar,
  } = props

  return (
    <Box>
      <Typography variant={variants.title1}>{title}</Typography>
      <Box alignItems="center" display="flex" justifyContent="flex-start" marginY={1}>
        <Box marginRight={1}>
          <Avatar alt="Organizer" onClick={onClickAvatar} src={organizerPictureURL} />
        </Box>
        <Box>
          <Typography color={isAssociation ? 'primary' : undefined} variant={variants.footNote}>
            {organizerLabel}
          </Typography>
        </Box>
      </Box>
      <Box marginY={2}>
        {actions}
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
