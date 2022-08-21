import Head from 'next/head';
import React from 'react';

import { cloudinaryBaseUrl } from 'components/image';
import { CARD_IMAGE } from 'constants/defaults';
import { domain } from 'constants/settings';

export default function PageMetadata({
  title,
  url = '',
  description = '',
  cardImage = CARD_IMAGE,
}: MetaProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name={'description'} content={description} />
      <meta
        name={'viewport'}
        content={'initial-scale=1.0, maximum-scale=1, width=device-width'}
      />
      <meta property={'og:title'} content={title} />
      <meta property={'og:description'} content={description} />
      <meta property={'og:url'} content={`${domain}${url}`} />
      <meta
        property={'og:image'}
        content={`${cloudinaryBaseUrl}/${cardImage}`}
      />
      <meta property={'og:image:alt'} content={title} />
    </Head>
  );
}

interface MetaProps {
  title: string;
  url?: string;
  description?: string;
  cardImage?: string;
}
