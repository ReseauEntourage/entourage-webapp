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

  const domain = env.SERVER_URL.replace(/https:\/\/|http:\/\//g, '')

  return (
    <Head>
      <script src={`https://tarteaucitron.io/load.js?domain=${domain}&uuid=0e7dccd2edb0f870afc26ab86d989e93ef6da0a9`} />
      <meta content={texts.nav.pageTitles.main} property="og:site_name" />
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
      <link href={constants.WEBAPP_PROD_LINK} rel="canonical" />
      <link href="/favicon.ico" rel="icon" />
      <base href="/" />
      <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />
      {/* App Banner */ }
      <meta content="Entourage," name="smartbanner:title" />
      <meta content="le réseau solidaire" name="smartbanner:author" />
      <meta content="Disponible" name="smartbanner:price" />
      <meta content=" sur l'App Store" name="smartbanner:price-suffix-apple" />
      <meta content=" sur le Google Play Store" name="smartbanner:price-suffix-google" />
      <meta content="/icon.png" name="smartbanner:icon-apple" />
      <meta content="/icon.png" name="smartbanner:icon-google" />
      <meta content="OUVRIR" name="smartbanner:button" />
      <meta content={constants.IOS_LINK} name="smartbanner:button-url-apple" />
      <meta content={constants.ANDROID_LINK} name="smartbanner:button-url-google" />
      <meta content="android,ios" name="smartbanner:enabled-platforms" />
      <meta content="Fermer" name="smartbanner:close-label" />
      {children}
    </Head>
  )
}
