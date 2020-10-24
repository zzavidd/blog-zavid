import React from 'react';
import { zDate } from 'zavid-modules';

import { AdminButton } from 'components/button';
import { Spacer, Toolbar } from 'components/layout';
import { Paragraph, Title } from 'components/text';
import { redevelopmentDate, zavidBirthday } from 'constants/settings';
import { isAuthenticated } from 'lib/cookies';
import css from 'styles/pages/Posts.module.scss';

const PageSingle = ({ page }) => {
  const substitutions = {
    lastModified: `**${zDate.formatDate(page.lastModified)}**`,
    myAge: zDate.calculateAge(zavidBirthday),
    redevelopmentDate: zDate.formatDate(redevelopmentDate),
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
          <AdminButton onClick={() => navigateToEdit(page.id)}>
            Edit Page
          </AdminButton>
        )}
      </Toolbar>
    </Spacer>
  );
};

const navigateToEdit = (id) => (location.href = `/admin/pages/edit/${id}`);

PageSingle.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default PageSingle;