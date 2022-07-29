import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

import Meta from 'src/partials/meta';

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
  const query = await Document.getInitialProps(ctx);
  return { ...query };
};
