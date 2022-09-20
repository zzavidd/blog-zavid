import type { GetServerSideProps } from 'next';
import React from 'react';
import { zDate, zText } from 'zavid-modules';

import type { PageDAO } from 'classes/pages/PageDAO';
import { AdminButton } from 'components/button';
import { Spacer, Toolbar } from 'components/layout';
import { Paragraph, Title } from 'components/text';
import {
  BLOG_REDEVELOPMENT_DATE,
  SITE_TITLE,
  ZAVID_BIRTHDAY,
} from 'constants/settings';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import AdminLock from 'fragments/AdminLock';
import Layout from 'fragments/Layout';
import PageMetadata from 'fragments/PageMetadata';
import SSR from 'private/ssr';
import css from 'styles/pages/Posts.module.scss';

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
      <Spacer>
        <div className={css['post-single']}>
          <Title className={css['post-single-title']}>{page.title}</Title>
          <Paragraph
            className={css['post-single-content']}
            substitutions={substitutions}>
            {page.content}
          </Paragraph>
        </div>
        <AdminLock>
          <Toolbar spaceItems={true} hasBackButton={true}>
            <AdminButton onClick={() => navigateToEdit(page.id!)}>
              Edit Page
            </AdminButton>
          </Toolbar>
        </AdminLock>
      </Spacer>
    </React.Fragment>
  );
};

const navigateToEdit = (id: number): void => {
  location.href = `/admin/pages/edit/${id}`;
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
