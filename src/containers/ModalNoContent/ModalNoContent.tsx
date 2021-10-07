import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { Link } from 'src/components/Link'
import { Modal } from 'src/components/Modal'
import { useIsDesktop, variants } from 'src/styles'
import * as S from './ModalNoContent.styles'

interface Props {
  title: string;
  text: string;
  action?: string;
  actionText?: string;
  actionButton?: string;
  restText?: string;
}

export function ModalNoContent(props: Props) {
  const { title, text, action, actionText, actionButton, restText } = props
  const isDesktop = useIsDesktop()

  return (
    <Modal
      cancel={false}
      showCloseButton={true}
      title={title}
      validate={false}
    >
      <S.ModalContainer>
        <Typography align="center" variant={variants.bodyRegular}>
          {text}
        </Typography>
        {
          action && (
            <S.ActionContainer>
              {
                actionText
              && (
                <Typography align="center" variant={variants.bodyBold}>
                  {actionText}
                </Typography>
              )
              }
              <Link align="center" color="primary" href={action} target="_blank" variant={variants.bodyRegular}>
                {actionButton}
              </Link>
            </S.ActionContainer>
          )
        }
        {
          restText && (
            <Box marginTop={2}>
              <Typography align="center" variant={variants.bodyRegular}>
                {restText}
              </Typography>
            </Box>
          )
        }

        {isDesktop && (
          <S.ImageContainer>
            <img
              alt="Personnage"
              src="/personnage-dialogue-2.png"
              width="75"
            />
          </S.ImageContainer>
        )}
      </S.ModalContainer>
    </Modal>
  )
}
