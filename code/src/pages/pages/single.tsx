import { NextPageContext } from 'next';
import React from 'react';
import { zDate } from 'zavid-modules';

import { PageDAO } from 'classes';
import { AdminButton } from 'src/components/button';
import { Spacer, Toolbar } from 'src/components/layout';
import { Paragraph, Title } from 'src/components/text';
import { redevelopmentDate, zavidBirthday } from 'src/constants/settings';
import { isAuthenticated } from 'src/lib/cookies';
import css from 'src/styles/pages/Posts.module.scss';

const PageSingle = ({ page }: PageSingle) => {
  const substitutions = {
    lastModified: `**${zDate.formatDate(page.lastModified!)}**`,
    myAge: zDate.calculateAge(zavidBirthday),
    redevelopmentDate: zDate.formatDate(redevelopmentDate)
  };

  return (
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
  );
};

const navigateToEdit = (id: number): void => {
  location.href = `/admin/pages/edit/${id}`;
};

PageSingle.getInitialProps = async ({ query }: NextPageContext) => {
  return { ...query };
};

export default PageSingle;

interface PageSingle {
  page: PageDAO;
}
