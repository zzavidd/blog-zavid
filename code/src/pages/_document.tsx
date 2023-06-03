import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class AppDocument extends Document {
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
