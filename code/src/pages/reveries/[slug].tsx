import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import type { PathDefinition } from 'src/constants/paths';
import type { PostTemplatePageProps } from 'src/fragments/posts/template';
import PostTemplatePage from 'src/fragments/posts/template';
import PageMetadata from 'src/partials/meta';

import { getReverieBySlugSSR } from '../api/posts';

const PostPage: NextPage<PostPageProps> = ({ pathDefinition, pageProps }) => {
  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <PostTemplatePage {...pageProps} />
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps<PostPageProps> = async ({
  query,
}) => {
  return { props: JSON.parse(await getReverieBySlugSSR(query.slug as string)) };
};

export default PostPage;

interface PostPageProps {
  pathDefinition: PathDefinition;
  pageProps: PostTemplatePageProps;
}
