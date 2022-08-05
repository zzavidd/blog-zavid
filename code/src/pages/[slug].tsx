import type { GetServerSideProps, NextPage } from 'next';
import { zDate } from 'zavid-modules';

import type { PageDAO } from 'classes';
import { AdminButton } from 'src/components/button';
import { Spacer, Toolbar } from 'src/components/layout';
import { Paragraph, Title } from 'src/components/text';
import { isAuthenticated } from 'src/lib/cookies';
import { redevelopmentDate, zavidBirthday } from 'src/settings';
import css from 'src/styles/pages/Posts.module.scss';

import { getPageBySlug, getPageBySlugX } from './api/pages/[slug]';

const PageSingleProps: NextPage<PageSingleProps> = ({ page }) => {
  const substitutions = {
    lastModified: `**${zDate.formatDate(page.lastModified!)}**`,
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

export const getServerSideProps: GetServerSideProps<
  Partial<PageSingleProps>
> = async ({ query }) => {
  const page = JSON.parse(await getPageBySlugX(query.slug as string));
  return { props: { page } };
};

export default PageSingleProps;

interface PageSingleProps {
  page: PageDAO;
}
