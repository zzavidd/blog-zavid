import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import React from 'react';

import { PostStatic } from 'classes/posts/PostStatic';
import Settings from 'constants/settings';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import { IPostStatus, IPostType } from 'constants/types';
import Layout from 'fragments/Layout';
import type { PostTrio } from 'fragments/posts/PostTemplatePage';
import PostTemplatePage from 'fragments/posts/PostTemplatePage';
import * as ZText from 'lib/text';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import SSR from 'private/ssr';
import AS from 'styles/Pages/Article.styles';

// eslint-disable-next-line react/function-component-definition
const EpistlePage: NextPageWithLayout<EpistlePageProps> = ({ pageProps }) => {
  return (
    <AS.Container>
      <PostTemplatePage {...pageProps} />
    </AS.Container>
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
        type: IPostType.EPISTLE,
        statusFilters: {
          exclude: [IPostStatus.DRAFT],
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
          title: `#${epistle.typeId}: ${epistle.title} | ${Settings.SITE_TITLE}`,
          description: epistle.excerpt || ZText.extractExcerpt(epistle.content),
          url: `/epistles/${epistle.slug}`,
          cardImage: epistle.image as string,
          article: {
            publishedTime: epistle.datePublished as string,
            tags: (epistle.tags as string[]) || [],
          },
        },
        pageProps: epistleTrio,
      },
    };
  } catch (e) {
    console.error(e);
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
