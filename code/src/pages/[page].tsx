import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { zDate, zText } from 'zavid-modules';

import type { PageDAO } from 'classes';
import { AdminButton } from 'src/components/button';
import { Spacer, Toolbar } from 'src/components/layout';
import { Paragraph, Title } from 'src/components/text';
import type { PathDefinition } from 'src/constants/paths';
import { isAuthenticated } from 'src/lib/cookies';
import PageMetadata from 'src/partials/meta';
import { redevelopmentDate, siteTitle, zavidBirthday } from 'src/settings';
import css from 'src/styles/pages/Posts.module.scss';

import { getPageBySlugSSR } from './api/pages';

// eslint-disable-next-line react/function-component-definition
const PageSingleProps: NextPage<PageSingleProps> = ({
  pathDefinition,
  page,
}) => {
  const substitutions = {
    lastModified: `**${zDate.formatDate(page.lastModified!)}**`,
    myAge: zDate.calculateAge(zavidBirthday),
    redevelopmentDate: zDate.formatDate(redevelopmentDate),
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
        <Toolbar spaceItems={true} hasBackButton={true}>
          {isAuthenticated() && (
            <AdminButton onClick={() => navigateToEdit(page.id!)}>
              Edit Page
            </AdminButton>
          )}
        </Toolbar>
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
    const page = JSON.parse(await getPageBySlugSSR(query.page as string));
    return {
      props: {
        pathDefinition: {
          title: `${page.title} | ${siteTitle}`,
          description: zText.extractExcerpt(page.content!),
          url: `/${query.page}`,
        },
        page,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default PageSingleProps;

interface PageSingleProps {
  pathDefinition: PathDefinition;
  page: PageDAO;
}
