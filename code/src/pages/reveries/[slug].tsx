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
    const reverieTrio = JSON.parse(
      await getPostSSR({
        slug: query.slug as string,
        type: PostType.REVERIE,
        statusFilters: {
          exclude: [PostStatus.DRAFT],
        },
      }),
    ) as PostTemplatePageProps;

    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    if (!session && PostStatic.isProtected(reverieTrio.current)) {
      throw new Error('No reverie found');
    }

    return {
      props: {
        pathDefinition: {
          title: `${reverieTrio.current.title} | ${siteTitle}`,
          description: JSON.stringify(reverieTrio.current.excerpt),
          url: `/reveries/${reverieTrio.current.slug}`,
          cardImage: JSON.stringify(reverieTrio.current.image),
        },
        pageProps: reverieTrio,
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
