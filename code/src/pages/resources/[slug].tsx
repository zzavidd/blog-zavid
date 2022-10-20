import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import Settings from 'constants/settings';

// eslint-disable-next-line react/function-component-definition
const Resource: NextPage<ResourceProps> = ({ href }) => {
  return (
    <iframe
      src={`${href}#viewFitV`}
      style={{ height: '100vh', width: '100%' }}
      allow={'fullscreen'}
    />
  );
};

export const getServerSideProps: GetServerSideProps<ResourceProps> = async ({
  query,
  // eslint-disable-next-line require-await
}) => {
  const url = Settings.RESOURCE_MAP[query.slug as string];
  return {
    props: {
      href: `${Settings.CLOUDINARY_BASE_URL}/${url}`,
    },
  };
};

export default Resource;

interface ResourceProps {
  href: string;
}
