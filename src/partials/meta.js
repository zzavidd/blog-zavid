import React from 'react';

import { cloudinaryBaseUrl } from 'components/image';
import { domain } from 'constants/settings';

export default ({
  title = 'Page Not Found',
  ogUrl = '',
  description = '',
  cardImage = 'static/bg/card-home.jpg'
}) => {
  return (
    <>
      {/* Page information */}
      <meta charSet="UTF-8" name="author" content="Zavid Egbue" />
      <meta
        name="viewport"
        content="initial-scale=1.0, maximum-scale=1, width=device-width"
      />

      <title>{title}</title>
      <meta name="description" content={description} />

      {/* OpenGraph meta tags for search engine optimisation */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${domain}${ogUrl}`} />

      <meta property="og:image" content={`${cloudinaryBaseUrl}/${cardImage}`} />
      <meta property="og:image:height" content="800" />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="ZAVID" />
      <meta
        name="google-site-verification"
        content="Kv9Zk269oRFxqqh7W9amnHVXRsR8qREsGK4dk0a1SQk"
      />
      <meta name="twitter:card" content="summary_large_image" />

      {/* Favicon */}
      <link
        rel={'icon'}
        href={`${cloudinaryBaseUrl}/static/logos/favicon.png`}
      />
    </>
  );
};
