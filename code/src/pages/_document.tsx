import type { DocumentContext } from 'next/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

export default class AppDocument extends Document {
  public static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
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
        <body className={'body'}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
