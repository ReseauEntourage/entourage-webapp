import { Box, Typography } from '@material-ui/core'
import Link from 'next/link'
import React from 'react'
import { Button } from 'src/components/Button'
import { Link as CustomLink } from 'src/components/Link'
import { texts } from 'src/i18n'
import { variants } from 'src/styles'

export default function Custom404() {
  return (
    <Box
      alignItems="center"
      alignSelf="stretch"
      display="flex"
      flex="1"
      flexDirection="column"
      height="100%"
      justifyContent="center"
      width="100%"
    >
      <img
        alt="Personnage"
        src="/personnage-dialogue-2.png"
        width="75"
      />
      <Box
        marginBottom={2}
        marginLeft={3}
        marginRight={3}
        marginTop={3}
      >
        <Typography align="center" variant={variants.title1}>{texts.nav.error.message}</Typography>
      </Box>
      <Link href="/actions" passHref={true}>
        <CustomLink>
          <Button>
            {texts.nav.error.back}
          </Button>
        </CustomLink>
      </Link>
    </Box>
  )
}
