import { Button, Card, CardActions, CardContent, CardHeader, CardMedia } from '@material-ui/core/'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { Avatar } from 'src/components/Avatar'

export { iconStyle } from './FeedAnnouncement.styles'

interface FeedAnnouncementProps {
  title: string;
  body?: string;
  imageUrl?: string;
  action?: string;
  url?: string;
  iconUrl: string;
}

export function FeedAnnouncement(props: FeedAnnouncementProps) {
  const {
    title, body, imageUrl, action, url, iconUrl,
  } = props

  return (
    <a href={url}>
      <Card>
        <CardHeader
          avatar={(
            <Avatar src={iconUrl} />
          )}
          subheader="September 14, 2016"
          title={title}
        />
        <CardMedia
          image={imageUrl}
          title="Paella dish"
        />
        <CardContent>
          <Typography color="textSecondary" component="p" variant="body2">
            {body}
          </Typography>
        </CardContent>
        <CardActions disableSpacing={true}>
          <Button>
            {action}
          </Button>
        </CardActions>
      </Card>
    </a>
  )
}
