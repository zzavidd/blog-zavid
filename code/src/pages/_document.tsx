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
      <Html>
        <Head>
          {/* Page information */}
          <meta charSet={'UTF-8'} name={'author'} content={'Zavid Egbue'} />

          {/* OpenGraph meta tags for search engine optimisation */}
          <meta property={'og:type'} content={'website'} />

          <meta property={'og:image:height'} content={'800'} />
          <meta property={'og:image:width'} content={'800'} />
          <meta property={'og:image:type'} content={'image/jpeg'} />
          <meta property={'og:site_name'} content={'ZAVID'} />

          <meta
            name={'google-site-verification'}
            content={'qgOq7Q6kwa0UjcKwV6p7Z6GkM8W45hn655lE_op91Qw'}
          />
          <meta name={'twitter:card'} content={'summary_large_image'} />
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
