import type { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth';
import React from 'react';

import { PostType, PostStatus, PostStatic } from 'classes';
import type { PathDefinition } from 'constants/paths';
import { siteTitle } from 'constants/settings';
import PageMetadata from 'fragments/PageMetadata';
import type { PostTemplatePageProps } from 'fragments/posts/template';
import PostTemplatePage from 'fragments/posts/template';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';

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
  req,
  res,
}) => {
  try {
    const epistleTrio = JSON.parse(
      await getPostSSR({
        slug: query.slug as string,
        type: PostType.EPISTLE,
        statusFilters: {
          exclude: [PostStatus.DRAFT],
        },
      }),
    ) as PostTemplatePageProps;

    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    if (!session && PostStatic.isProtected(epistleTrio.current)) {
      throw new Error('No epistle found');
    }

    return {
      props: {
        pathDefinition: {
          title: `${epistleTrio.current.title} | ${siteTitle}`,
          description: JSON.stringify(epistleTrio.current.excerpt),
          url: `/epistles/${epistleTrio.current.slug}`,
          cardImage: JSON.stringify(epistleTrio.current.image),
        },
        pageProps: epistleTrio,
      },
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
