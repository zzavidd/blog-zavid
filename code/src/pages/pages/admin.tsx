import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import { NextPageContext } from 'next';
import React, { useEffect, useState } from 'react';
import { zDate, zText } from 'zavid-modules';

import { EditButton, PageDAO, ReactHook } from 'classes';
import { alert, reportError } from 'src/components/alert';
import { AdminButton, InvisibleButton } from 'src/components/button';
import { Spacer, Toolbar } from 'src/components/layout';
import { ConfirmModal } from 'src/components/modal';
import { Icon, Tabler, TablerColumnHeader, TablerFieldType, TablerItemCell } from 'src/lib/library';
import {
  GET_PAGES_QUERY,
  DELETE_PAGE_QUERY
} from 'src/private/api/queries/page.queries';

const PageAdmin = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState({} as PageDAO);
  const [isLoaded, setLoaded] = useState(false);
  const [deleteModalVisible, setDeleteModalVisibility] = useState(false);

  const {
    data,
    error: queryError,
    loading: queryLoading,
    refetch,
    networkStatus
  } = useQuery(GET_PAGES_QUERY, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });
  const [deletePageMutation] = useMutation(DELETE_PAGE_QUERY);

  useEffect(() => {
    if (networkStatus === NetworkStatus.refetch) return;
    if (queryLoading) return;
    if (queryError) alert.error(queryError);

    setPages(data ? data.pages : []);
    setLoaded(true);
  }, [queryLoading, networkStatus]);

  const deletePage = () => {
    const { id, title }: PageDAO = selectedPage;
    Promise.resolve()
      .then(() => deletePageMutation({ variables: { id } }))
      .then(() => {
        alert.success(`You've deleted the ${title} page.`);
        setDeleteModalVisibility(false);
        refetch();
      })
      .catch(reportError);
  };

  return (
    <>
      <Spacer>
        <Tabler<9>
          heading={'List of Pages'}
          itemsLoaded={
            isLoaded && !queryLoading && networkStatus !== NetworkStatus.refetch
          }
          emptyMessage={'No pages found.'}
          columns={[
            new TablerColumnHeader('#', { centerAlign: true }),
            new TablerColumnHeader('Title'),
            new TablerColumnHeader('Slug'),
            new TablerColumnHeader('Excerpt'),
            new TablerColumnHeader('Content'),
            new TablerColumnHeader('Last Modified')
          ]}
          items={pages.map((page: PageDAO, key: number) => {
            return [
              new TablerItemCell(key + 1, { type: TablerFieldType.INDEX }),
              new TablerItemCell(page.title!, { icon: 'heading' }),
              new TablerItemCell(page.slug ? `/${page.slug}` : '', {
                icon: 'link',
                hideIfEmpty: true
              }),
              new TablerItemCell(
                zText.truncateText(page.excerpt!, { limit: 30 }),
                { hideOnMobile: true }
              ),
              new TablerItemCell(
                zText.truncateText(page.content!, { limit: 30 }),
                { hideOnMobile: true }
              ),
              new TablerItemCell(
                zDate.formatDate(page.lastModified!),
                { icon: 'clock' }
              ),
              new TablerItemCell(<LinkButton page={page} key={key} />, {
                type: TablerFieldType.BUTTON
              }),
              new TablerItemCell(<EditButton id={page.id!} key={key} />, {
                type: TablerFieldType.BUTTON
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
                { type: TablerFieldType.BUTTON }
              )
            ];
          })}
          distribution={['6%', '0.8fr', '10%', '1fr', '1fr', '30%', '4%', '4%', '4%']}
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
    </>
  );
};

const navigateToCreateForm = () => {
  location.href = '/admin/pages/add';
};

const LinkButton = ({ page }: LinkButton) => {
  if (page.isEmbed) return null;

  const navigateToLink = () => (location.href = `/${page.slug}`);

  return (
    <InvisibleButton onClick={navigateToLink}>
      <Icon name={'paper-plane'} />
    </InvisibleButton>
  );
};

const EditButton = ({ id }: EditButton) => {
  const navigateToLink = () => (location.href = `/admin/pages/edit/${id}`);
  return (
    <InvisibleButton onClick={navigateToLink}>
      <Icon name={'pen-alt'} />
    </InvisibleButton>
  );
};

const DeleteButton = ({
  page,
  setDeleteModalVisibility,
  setSelectedPage
}: DeleteButton) => {
  const attemptDelete = () => {
    setDeleteModalVisibility(true);
    setSelectedPage(page);
  };

  return (
    <InvisibleButton onClick={attemptDelete}>
      <Icon name={'trash'} />
    </InvisibleButton>
  );
};

PageAdmin.getInitialProps = async ({ query }: NextPageContext) => {
  return { ...query };
};

export default PageAdmin;

interface LinkButton {
  page: PageDAO;
}

interface DeleteButton {
  page: PageDAO;
  setDeleteModalVisibility: (event: boolean) => void;
  setSelectedPage: ReactHook<PageDAO>;
}
