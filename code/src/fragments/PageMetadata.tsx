import Head from 'next/head';
import React from 'react';

import { CARD_IMAGE, CLOUDINARY_BASE_URL, DOMAIN } from 'constants/settings';
import type { PathDefinition } from 'constants/types';
import ZString from 'lib/string';

export default function PageMetadata({
  title,
  url = '',
  description = '',
  cardImage = CARD_IMAGE,
  article,
}: PathDefinition) {
  const ogUrl = `${DOMAIN}${url}`;
  const ogImage = `${CLOUDINARY_BASE_URL}/${cardImage}`;
  return (
    <Head>
      <title>{title}</title>
      <meta name={'description'} content={description} />
      {article ? (
        <meta
          name={'keywords'}
          content={ZString.convertArrayToCsv(article!.tags)}
        />
      ) : null}
      <meta
        name={'viewport'}
        content={'initial-scale=1.0, maximum-scale=1, width=device-width'}
      />

      {/* OpenGraph meta tags for search engine optimisation */}
      <meta property={'og:title'} content={title} />
      <meta property={'og:description'} content={description} />
      <meta property={'og:url'} content={ogUrl} />
      <meta property={'og:image'} content={ogImage} />
      <meta property={'og:image:height'} content={'800'} />
      <meta property={'og:image:width'} content={'800'} />
      <meta property={'og:image:type'} content={'image/jpeg'} />
      <meta property={'og:image:alt'} content={title} />
      <meta property={'og:site_name'} content={'ZAVID'} />
      <meta property={'twitter:card'} content={'summary_large_image'} />
      <meta property={'twitter:url'} content={ogUrl} />
      <meta property={'twitter:description'} content={description} />
      <meta property={'twitter:image'} content={ogImage} />

      <meta property={'og:type'} content={article ? 'article' : 'website'} />

      {article ? (
        <React.Fragment>
          <meta property={'article:author'} content={'Zavid Egbue'} />
          <meta
            property={'article:published_time'}
            content={article!.publishedTime}
          />
          {article!.tags.map((tag) => {
            return <meta property={'article:tag'} content={tag} key={tag} />;
          })}
        </React.Fragment>
      ) : null}
    </Head>
  );
}
