import type { DocumentContext } from 'next/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class AppDocument extends Document {
  /**
   * Support SSR for Styled Components.
   * @param ctx The document context.
   * @returns The document props.
   */
  public static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      };
    } finally {
      sheet.seal();
    }
  }

  public render() {
    return (
      <Html lang={'en'}>
        <Head>
          <meta charSet={'UTF-8'} name={'author'} content={'Zavid Egbue'} />
          <meta
            name={'google-site-verification'}
            content={'pTyeDJ3sNXD05yIxUQgX8k0Iw0_IjjRGgc_Xs49WgGI'}
          />
          <meta
            name={'facebook-domain-verification'}
            content={'x5godw4ipzopqpyw778h62ucn70mfl'}
          />
          <link rel={'icon'} href={'/favicon.png'} />

          <link rel={'preconnect'} href={'https://fonts.googleapis.com'} />
          <link
            rel={'preconnect'}
            href={'https://fonts.gstatic.com'}
            crossOrigin={'anonymous'}
          />
          <link
            href={
              'https://fonts.googleapis.com/css2?family=Calistoga&family=Mulish:wght@400;700&family=Passion+One:wght@400;700&display=swap'
            }
            rel={'stylesheet'}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
