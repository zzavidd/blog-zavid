import type { GetServerSideProps } from 'next';
import React from 'react';
import { zDate, zText } from 'zavid-modules';

import type { PageDAO } from 'classes/pages/PageDAO';
import {
  BLOG_REDEVELOPMENT_DATE,
  SITE_TITLE,
  ZAVID_BIRTHDAY,
} from 'constants/settings';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import Layout from 'fragments/Layout';
import PageMetadata from 'fragments/PageMetadata';
import SSR from 'private/ssr';
import PageStyle from 'stylesv2/Pages/Page.styles';

// eslint-disable-next-line react/function-component-definition
const PageSingle: NextPageWithLayout<PageSingleProps> = ({
  pathDefinition,
  pageProps,
}) => {
  const { page } = pageProps;
  const substitutions = {
    lastModified: `**${zDate.formatDate(page.lastModified!)}**`,
    myAge: zDate.calculateAge(ZAVID_BIRTHDAY),
    redevelopmentDate: zDate.formatDate(BLOG_REDEVELOPMENT_DATE),
  };

  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <PageStyle.Container>
        <PageStyle.Main>
          <PageStyle.Title>{page.title}</PageStyle.Title>
          <PageStyle.Content substitutions={substitutions}>
            {page.content}
          </PageStyle.Content>
        </PageStyle.Main>
      </PageStyle.Container>
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps<PageSingleProps> = async ({
  query,
}) => {
  try {
    const page = JSON.parse(await SSR.Pages.getBySlug(query.page as string));
    return {
      props: {
        pathDefinition: {
          title: `${page.title} | ${SITE_TITLE}`,
          description: zText.extractExcerpt(page.content!),
          url: `/${query.page}`,
        },
        pageProps: {
          page,
        },
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

PageSingle.getLayout = Layout.addPartials;
export default PageSingle;

interface PageSingleProps {
  pathDefinition: PathDefinition;
  pageProps: {
    page: PageDAO;
  };
}
