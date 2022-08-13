import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import { PostType, PostStatus } from 'classes';
import type { PathDefinition } from 'src/constants/paths';
import type { PostTemplatePageProps } from 'src/fragments/posts/template';
import PostTemplatePage from 'src/fragments/posts/template';
import PageMetadata from 'src/partials/meta';

import { getPostSSR } from '../api/posts';

// eslint-disable-next-line react/function-component-definition
const EpistlePage: NextPage<EpistlePageProps> = ({
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

export const getServerSideProps: GetServerSideProps<EpistlePageProps> = async ({
  query,
}) => {
  try {
    return {
      props: JSON.parse(
        await getPostSSR(query.slug as string, PostType.EPISTLE, {
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

export default EpistlePage;

interface EpistlePageProps {
  pathDefinition: PathDefinition;
  pageProps: PostTemplatePageProps;
}
