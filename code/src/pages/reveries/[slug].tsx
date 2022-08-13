import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import type { PathDefinition } from 'src/constants/paths';
import type { PostTemplatePageProps } from 'src/fragments/posts/template';
import PostTemplatePage from 'src/fragments/posts/template';
import PageMetadata from 'src/partials/meta';

import { getReverieBySlugSSR } from '../api/posts';

const ReveriePage: NextPage<ReveriePageProps> = ({
  pathDefinition,
  pageProps,
}) => {
  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <PostTemplatePage {...pageProps} />
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps<ReveriePageProps> = async ({
  query,
}) => {
  return { props: JSON.parse(await getReverieBySlugSSR(query.slug as string)) };
};

export default ReveriePage;

interface ReveriePageProps {
  pathDefinition: PathDefinition;
  pageProps: PostTemplatePageProps;
}
