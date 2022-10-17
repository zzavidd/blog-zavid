import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import React from 'react';

import { PostStatus, PostType } from 'classes/posts/PostDAO';
import { PostStatic } from 'classes/posts/PostStatic';
import { SITE_TITLE } from 'constants/settings';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import Layout from 'fragments/Layout';
import PageMetadata from 'fragments/PageMetadata';
import type { PostTrio } from 'fragments/posts/PostTemplatePage';
import PostTemplatePage from 'fragments/posts/PostTemplatePage';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import SSR from 'private/ssr';

// eslint-disable-next-line react/function-component-definition
const EpistlePage: NextPageWithLayout<EpistlePageProps> = ({
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
      await SSR.Posts.getSingle({
        slug: query.slug as string,
        type: PostType.EPISTLE,
        statusFilters: {
          exclude: [PostStatus.DRAFT],
        },
      }),
    ) as PostTrio;
    const epistle = epistleTrio.current;

    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    if (!session && PostStatic.isProtected(epistleTrio.current)) {
      throw new Error('No epistle found.');
    }

    if (!PostStatic.isPublished(epistle)) {
      res.setHeader('X-Robots-Tag', 'noindex');
    }

    return {
      props: {
        pathDefinition: {
          title: `${epistle.title} | ${SITE_TITLE}`,
          description: JSON.stringify(epistle.excerpt),
          url: `/epistles/${epistle.slug}`,
          cardImage: epistle.image as string,
          article: {
            publishedTime: epistle.datePublished as string,
            tags: JSON.parse(epistle.tags as string),
          },
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

EpistlePage.getLayout = Layout.addPartials;
export default EpistlePage;

interface EpistlePageProps {
  pathDefinition: PathDefinition;
  pageProps: PostTrio;
}
