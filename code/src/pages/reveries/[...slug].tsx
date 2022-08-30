import type { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import React from 'react';
import { zText } from 'zavid-modules';

import type { PostDAO } from 'classes';
import { PostStatic, PostStatus, PostType } from 'classes';
import { siteTitle } from 'constants/settings';
import type { PathDefinition } from 'constants/types';
import PageMetadata from 'fragments/PageMetadata';
import type { PostTemplatePageProps } from 'fragments/posts/PostTemplatePage';
import PostTemplatePage from 'fragments/posts/PostTemplatePage';
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
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  const validateAuthorisation = (post: PostDAO) => {
    if (!session && PostStatic.isProtected(post)) {
      throw new Error('No reverie found.');
    }
  };

  try {
    if (!Array.isArray(query.slug)) {
      throw new Error('Query slug is not an array.');
    }

    if (query.slug.length > 1) {
      const [domainSlug, slug] = query.slug;
      const { current: post } = JSON.parse(
        await getPostSSR({
          slug,
          type: PostType.PAGE,
          domainSlug,
          domainType: PostType.REVERIE,
          statusFilters: { exclude: [PostStatus.DRAFT] },
        }),
      ) as PostTemplatePageProps;

      validateAuthorisation(post);

      const pathDefinition: PathDefinition = {
        title: `${post.title} | ${siteTitle}`,
        description: post.excerpt || zText.extractExcerpt(post.content!),
        url: `/reveries/${domainSlug}/${slug}`,
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
        await getPostSSR({
          slug,
          type: PostType.REVERIE,
          statusFilters: {
            exclude: [PostStatus.DRAFT],
          },
        }),
      ) as PostTemplatePageProps;

      validateAuthorisation(reverieTrio.current);

      const pathDefinition: PathDefinition = {
        title: `${reverieTrio.current.title} | ${siteTitle}`,
        description: JSON.stringify(reverieTrio.current.excerpt),
        url: `/reveries/${reverieTrio.current.slug}`,
      };
      if (reverieTrio.current.image) {
        pathDefinition.cardImage = reverieTrio.current.image as string;
      }

      return {
        props: {
          pathDefinition: {
            title: `${reverieTrio.current.title} | ${siteTitle}`,
            description: JSON.stringify(reverieTrio.current.excerpt),
            url: `/reveries/${reverieTrio.current.slug}`,
            cardImage: reverieTrio.current.image as string,
          },
          pageProps: reverieTrio,
        },
      };
    }
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
