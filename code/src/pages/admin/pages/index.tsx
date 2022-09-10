import type { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { zDate, zText } from 'zavid-modules';

import type { PageDAO } from 'classes/pages/PageDAO';
import { AdminButton, InvisibleButton } from 'components/button';
import { Spacer, Toolbar } from 'components/layout';
import {
  Icon,
  Tabler,
  TablerColumnHeader,
  TablerFieldType,
  TablerItemCell,
} from 'components/library';
import { ConfirmModal } from 'components/modal';
import Alert from 'constants/alert';
import type {
  EditButtonProps,
  PathDefinition,
  ReactHook,
} from 'constants/types';
import Utils from 'constants/utils';
import PageMetadata from 'fragments/PageMetadata';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import SSR from 'private/ssr';

// eslint-disable-next-line react/function-component-definition
const PageAdmin: NextPage<PageAdminProps> = ({ pathDefinition, pageProps }) => {
  const { pages } = pageProps;
  const [selectedPage, setSelectedPage] = useState<PageDAO>({});
  const [deleteModalVisible, setDeleteModalVisibility] = useState(false);

  const router = useRouter();

  async function deletePage() {
    const { id, title } = selectedPage;
    try {
      await Utils.request('/api/pages', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      Alert.success(`You've deleted the ${title} page.`);
      router.reload();
      setDeleteModalVisibility(false);
    } catch (e: any) {
      reportError(e.message);
    }
  }

  function navigateToCreateForm() {
    void router.push('/admin/pages/add');
  }

  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <Spacer>
        <Tabler<9>
          heading={'List of Pages'}
          itemsLoaded={true}
          emptyMessage={'No pages found.'}
          columns={[
            new TablerColumnHeader('#', { centerAlign: true }),
            new TablerColumnHeader('Title'),
            new TablerColumnHeader('Slug'),
            new TablerColumnHeader('Excerpt'),
            new TablerColumnHeader('Content'),
            new TablerColumnHeader('Last Modified'),
          ]}
          items={pages.map((page: PageDAO, key: number) => {
            return [
              new TablerItemCell(key + 1, { type: TablerFieldType.INDEX }),
              new TablerItemCell(page.title!, { icon: 'heading' }),
              new TablerItemCell(page.slug ? `/${page.slug}` : '', {
                icon: 'link',
                hideIfEmpty: true,
              }),
              new TablerItemCell(
                zText.truncateText(page.excerpt!, { limit: 30 }),
                { hideOnMobile: true },
              ),
              new TablerItemCell(
                zText.truncateText(page.content!, { limit: 30 }),
                { hideOnMobile: true },
              ),
              new TablerItemCell(zDate.formatDate(page.lastModified!), {
                icon: 'clock',
              }),
              new TablerItemCell(<LinkButton page={page} key={key} />, {
                type: TablerFieldType.BUTTON,
              }),
              new TablerItemCell(<EditButton id={page.id!} key={key} />, {
                type: TablerFieldType.BUTTON,
              }),
              new TablerItemCell(
                (
                  <DeleteButton
                    page={page}
                    key={key}
                    setDeleteModalVisibility={setDeleteModalVisibility}
                    setSelectedPage={setSelectedPage}
                  />
                ),
                { type: TablerFieldType.BUTTON },
              ),
            ];
          })}
          distribution={[
            '6%',
            '0.8fr',
            '10%',
            '1fr',
            '1fr',
            '30%',
            '4%',
            '4%',
            '4%',
          ]}
        />
        <Toolbar>
          <AdminButton onClick={navigateToCreateForm}>Add New Page</AdminButton>
        </Toolbar>
      </Spacer>
      <ConfirmModal
        visible={deleteModalVisible}
        message={`Are you sure you want to delete the **${selectedPage.title}** page?`}
        confirmFunction={deletePage}
        confirmText={'Delete'}
        closeFunction={() => setDeleteModalVisibility(false)}
      />
    </React.Fragment>
  );
};

function LinkButton({ page }: LinkButton) {
  if (page.isEmbed) return null;

  const navigateToLink = () => (location.href = `/${page.slug}`);

  return (
    <InvisibleButton onClick={navigateToLink}>
      <Icon name={'paper-plane'} />
    </InvisibleButton>
  );
}

function EditButton({ id }: EditButtonProps) {
  const navigateToLink = () => (location.href = `/admin/pages/edit/${id}`);
  return (
    <InvisibleButton onClick={navigateToLink}>
      <Icon name={'pen-alt'} />
    </InvisibleButton>
  );
}

function DeleteButton({
  page,
  setDeleteModalVisibility,
  setSelectedPage,
}: DeleteButton) {
  const attemptDelete = () => {
    setDeleteModalVisibility(true);
    setSelectedPage(page);
  };

  return (
    <InvisibleButton onClick={attemptDelete}>
      <Icon name={'trash'} />
    </InvisibleButton>
  );
}

export const getServerSideProps: GetServerSideProps<PageAdminProps> = async ({
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  const pages = JSON.parse(await SSR.Pages.getAll({ isEmbed: false }));
  return {
    props: {
      pathDefinition: {
        title: 'List of Pages',
      },
      pageProps: {
        pages,
      },
    },
  };
};

export default PageAdmin;

interface PageAdminProps {
  pathDefinition: PathDefinition;
  pageProps: {
    pages: PageDAO[];
  };
}

interface LinkButton {
  page: PageDAO;
}

interface DeleteButton {
  page: PageDAO;
  setDeleteModalVisibility: (event: boolean) => void;
  setSelectedPage: ReactHook<PageDAO>;
}
