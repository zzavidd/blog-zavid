import React from 'react';

import { AdminButton } from 'components/button';
import { Spacer, Toolbar } from 'components/layout';
import { Paragraph, Title } from 'components/text';
import css from 'styles/pages/Posts.module.scss';

const PageSingle = ({ page }) => {
  const substitutions = {
    lastModified: page.lastModified
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
        {/* TODO: (Phase 2) Account for other post types */}
        <AdminButton onClick={() => navigateToEdit(page.id)}>
          Edit Page
        </AdminButton>
      </Toolbar>
    </Spacer>
  );
};

const navigateToEdit = (id) => (location.href = `/admin/pages/edit/${id}`);

PageSingle.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default PageSingle;
