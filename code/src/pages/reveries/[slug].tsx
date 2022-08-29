import type { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import React from 'react';

import { PostStatic, PostStatus, PostType } from 'classes';
import type { PathDefinition } from 'constants/paths';
import { siteTitle } from 'constants/settings';
import PageMetadata from 'fragments/PageMetadata';
import type { PostTemplatePageProps } from 'fragments/posts/template';
import PostTemplatePage from 'fragments/posts/template';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';

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
  req,
  res,
}) => {
  try {
    const postTrio = JSON.parse(
      await getPostSSR({
        slug: query.slug as string,
        type: PostType.REVERIE,
        statusFilters: {
          exclude: [PostStatus.DRAFT],
        },
      }),
    ) as PostTemplatePageProps;

    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    if (!session && PostStatic.isProtected(postTrio.current)) {
      throw new Error('No post found');
    }

    return {
      props: {
        pathDefinition: {
          title: `${postTrio.current.title} | ${siteTitle}`,
          description: JSON.stringify(postTrio.current.excerpt),
          url: `/reveries/${postTrio.current.slug}`,
          cardImage: JSON.stringify(postTrio.current.image),
        },
        pageProps: postTrio,
      },
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
