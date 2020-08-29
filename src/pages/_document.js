import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

import Meta from 'partials/helpers/app/meta';

export default class AppDocument extends Document {
  render() {
    const { query } = this.props.__NEXT_DATA__;
    return <AppMarkup query={query} />;
  }
}

const AppMarkup = ({ query }) => {
  return (
    <Html>
      <Head>
        <Meta {...query} />
      </Head>
      <body className={'body'}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

AppDocument.getInitialProps = async (ctx) => {
  const meta = await Document.getInitialProps(ctx);
  return { ...meta };
};
