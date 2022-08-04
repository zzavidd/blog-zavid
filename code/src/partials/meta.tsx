import Head from 'next/head';
import React from 'react';

import { cloudinaryBaseUrl } from 'src/components/image';
import { CARD_IMAGE } from 'src/constants/defaults';
import { domain } from 'src/settings';

export default function PageMetadata({
  title,
  url,
  description,
  cardImage = CARD_IMAGE
}: MetaProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name={'description'} content={description} />
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
  url: string;
  description: string;
  cardImage?: string;
}
