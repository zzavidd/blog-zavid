import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import { PostStatus, PostType } from 'classes';
import type { PathDefinition } from 'constants/paths';
import PageMetadata from 'fragments/partials/meta';
import type { PostTemplatePageProps } from 'fragments/posts/template';
import PostTemplatePage from 'fragments/posts/template';

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
  try {
    return {
      props: JSON.parse(
        await getPostSSR(query.slug as string, PostType.REVERIE, {
          exclude: [PostStatus.DRAFT],
        }),
      ),
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default ReveriePage;

interface ReveriePageProps {
  pathDefinition: PathDefinition;
  pageProps: PostTemplatePageProps;
}
