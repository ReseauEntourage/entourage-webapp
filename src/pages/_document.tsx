import { ServerStyleSheets as MaterialUiServerStyleSheets } from '@material-ui/styles'
import NextDocument, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'
import React from 'react'
import { ServerStyleSheet as StyledComponentSheets } from 'styled-components'

export default class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    const styledComponentSheet = new StyledComponentSheets()
    const materialUiSheets = new MaterialUiServerStyleSheets()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () => originalRenderPage({
        enhanceApp: (App) => (props) => styledComponentSheet.collectStyles(
          materialUiSheets.collect(<App {...props} />),
        ),
      })

      const initialProps = await NextDocument.getInitialProps(ctx)

      return {
        ...initialProps,
        styles: [
          <React.Fragment key="styles">
            {initialProps.styles}
            {materialUiSheets.getStyleElement()}
            {styledComponentSheet.getStyleElement()}
          </React.Fragment>,
        ],
      }
    } finally {
      styledComponentSheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
