import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
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
const ReveriePage: NextPageWithLayout<ReveriePageProps> = ({ pageProps }) => {
  return (
    <AS.Container>
      <PostTemplatePage {...pageProps} />
    </AS.Container>
  );
};

export const getServerSideProps: GetServerSideProps<ReveriePageProps> = async ({
  query,
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  const validateAuthorisation = (post: PostDAO) => {
    if (!session && PostStatic.isProtected(post)) {
      throw new Error('No reverie found.');
    }
    if (!PostStatic.isPublished(post)) {
      res.setHeader('X-Robots-Tag', 'noindex');
    }
  };

  try {
    if (!Array.isArray(query.slug)) {
      throw new Error('Query slug is not an array.');
    }

    if (query.slug.length > 1) {
      const [domainSlug, slug] = query.slug;
      const { current: post } = JSON.parse(
        await SSR.Posts.getSingle({
          slug,
          type: IPostType.PAGE,
          domainSlug,
          domainType: IPostType.REVERIE,
          statusFilters: { exclude: [IPostStatus.DRAFT] },
        }),
      ) as PostTrio;

      validateAuthorisation(post);

      const pathDefinition: PathDefinition = {
        title: `${post.title} | ${Settings.SITE_TITLE}`,
        description: post.excerpt || ZText.extractExcerpt(post.content!),
        url: `/reveries/${domainSlug}/${slug}`,
        article: {
          publishedTime: post.datePublished as string,
          tags: (post.tags as string[]) || [],
        },
      };

      if (post.image) {
        pathDefinition.cardImage = post.image as string;
      }

      return {
        props: {
          pathDefinition,
          pageProps: {
            current: post,
          },
        },
      };
    } else {
      const [slug] = query.slug;
      const reverieTrio = JSON.parse(
        await SSR.Posts.getSingle({
          slug,
          type: IPostType.REVERIE,
          statusFilters: {
            exclude: [IPostStatus.DRAFT],
          },
        }),
      ) as PostTrio;
      const reverie = reverieTrio.current;

      validateAuthorisation(reverie);

      const pathDefinition: PathDefinition = {
        title: `${reverie.title} | ${Settings.SITE_TITLE}`,
        description: reverie.excerpt || ZText.extractExcerpt(reverie.content),
        url: `/reveries/${reverie.slug}`,
        article: {
          publishedTime: reverie.datePublished as string,
          tags: (reverie.tags as string[]) || [],
        },
      };
      if (reverie.image) {
        pathDefinition.cardImage = reverie.image as string;
      }

      return {
        props: {
          pathDefinition,
          pageProps: reverieTrio,
        },
      };
    }
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
};

ReveriePage.getLayout = Layout.addPartials;
export default ReveriePage;

interface ReveriePageProps {
  pathDefinition: PathDefinition;
  pageProps: PostTrio;
}
