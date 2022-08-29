import type { GetServerSideProps, NextPage } from 'next';

import { cloudinaryBaseUrl, RESOURCE_MAP } from 'constants/settings';

// eslint-disable-next-line react/function-component-definition
const Resource: NextPage<ResourceProps> = ({ href }) => {
  return (
    <iframe
      src={href}
      style={{ height: '100vh', width: '100%' }}
      allow={'fullscreen'}
    />
  );
};

export const getServerSideProps: GetServerSideProps<ResourceProps> = async ({
  query,
}) => {
  const url = RESOURCE_MAP[query.slug as string];
  return {
    props: {
      href: `${cloudinaryBaseUrl}/${url}`,
    },
  };
};

export default Resource;

interface ResourceProps {
  href: string;
}