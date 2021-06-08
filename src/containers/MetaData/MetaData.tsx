import Head from 'next/head'
import React from 'react'
import { constants } from 'src/constants'
import { env } from 'src/core/env'
import { texts } from 'src/i18n'

const defaultMetaData = {
  metaTitle: texts.nav.pageTitles.main,
  metaImage: `${env.SERVER_URL}/share.jpeg`,
  metaDescription:
    texts.nav.pageDescriptions.main,
  metaType: 'website',
}

interface MetaDataProps {
  title?: string;
  description?: string;
  url: string;
  children?: JSX.Element[];
}

export function MetaData(props: MetaDataProps) {
  const {
    metaTitle,
    metaImage,
    metaDescription,
    metaType,
  } = defaultMetaData

  const { title = metaTitle, description = metaDescription, url, children } = props

  return (
    <Head>
      <meta content="Entourage" property="og:site_name" />
      <title>{title}</title>
      <meta content={title} name="twitter:title" />
      <meta content={title} property="og:title" />
      <meta content={description} property="og:description" />
      <meta content={description} name="description" />
      <meta content={description} name="twitter:description" />
      <meta content={url} property="og:url" />
      <meta content={metaImage} property="og:image" />
      <meta content={metaImage} name="image" />
      <meta content={metaImage} name="twitter:image" />
      <meta content={metaType} property="og:type" />
      <meta content="summary_large_image" name="twitter:card" />
      <meta content="@R_Entourage" name="twitter:site" />
      <meta content={constants.FB_APP_ID} property="fb:app_id" />
      <link href={constants.WEBAPP_PROD_LINK} rel="canonical" />
      <link href="/favicon.ico" rel="icon" />
      <base href="/" />
      <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />
      {children}
    </Head>
  )
}
