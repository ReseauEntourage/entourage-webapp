/* eslint-disable max-len */
import EmailIcon from '@material-ui/icons/Email'
import FacebookIcon from '@material-ui/icons/Facebook'
import TwitterIcon from '@material-ui/icons/Twitter'
import WhatsAppIcon from '@material-ui/icons/WhatsApp'
import React from 'react'
import styled from 'styled-components'
import { Button as ButtonBase } from 'src/components/Button'
import { Modal } from 'src/components/Modal'
import { env } from 'src/core/env'
import { theme } from 'src/styles'

const Button = styled(ButtonBase)`
  && {
    display: flex;
    margin: ${theme.spacing(2)}px auto;
    justify-content: start;
  }
`

interface ModalShareProps {
  content?: string;
  entourageUuid: string;
  title: string;
}

const colors = {
  facebook: '#3C5A99',
  twitter: '#1DA1F2',
  whatsApp: '#4AC959',
}

export function ModalShare(props: ModalShareProps) {
  const { title, content, entourageUuid } = props

  const linkURL = `${env.SERVER_URL}/actions/${entourageUuid}`

  const twitterText = `${title} ${linkURL} #chaleurHumaine`
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`

  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkURL)}`

  const whatsAppText = `${title} ${linkURL}`
  const whatsAppHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsAppText)}`

  const emailBody = `${content}\n\nRendez-vous sur Entourage, le réseau de la chaleur humaine : ${linkURL}`
  const emailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(emailBody)}`

  return (
    <Modal
      cancel={false}
      showCloseButton={true}
      title="Partager"
      validate={false}
    >
      <Button
        href={fbHref}
        startIcon={<FacebookIcon />}
        style={{ backgroundColor: colors.facebook }}
        target="_blank"
      >
        Partager sur Facebook
      </Button>
      <Button
        href={twitterHref}
        startIcon={<TwitterIcon />}
        style={{ backgroundColor: colors.twitter }}
        target="_blank"
      >
        Partager sur Twitter
      </Button>
      <Button
        href={whatsAppHref}
        startIcon={<WhatsAppIcon />}
        style={{ backgroundColor: colors.whatsApp }}
        target="_blank"
      >
        Envoyer par WhatsApp
      </Button>
      <Button
        href={emailHref}
        startIcon={<EmailIcon />}
      >
        Envoyer par Email
      </Button>
    </Modal>
  )
}
