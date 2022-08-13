import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import { PostStatus, PostType } from 'classes';
import type { PathDefinition } from 'src/constants/paths';
import type { PostTemplatePageProps } from 'src/fragments/posts/template';
import PostTemplatePage from 'src/fragments/posts/template';
import PageMetadata from 'src/partials/meta';

import { getPostSSR } from '../api/posts';

// eslint-disable-next-line react/function-component-definition
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
  return {
    props: JSON.parse(
      await getPostSSR(query.slug as string, PostType.REVERIE, {
        exclude: [PostStatus.DRAFT],
      }),
    ),
  };
};

export default ReveriePage;

interface ReveriePageProps {
  pathDefinition: PathDefinition;
  pageProps: PostTemplatePageProps;
}
