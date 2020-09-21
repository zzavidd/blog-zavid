import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { zDate, zText } from 'zavid-modules';

import { alert, reportError } from 'components/alert';
import { AdminButton, InvisibleButton } from 'components/button';
import { Icon } from 'components/icon';
import { Spacer, Toolbar } from 'components/layout';
import { ConfirmModal } from 'components/modal';
import Tabler, { TYPE } from 'components/tabler';
import {
  GET_PAGES_QUERY,
  DELETE_PAGE_QUERY
} from 'private/api/queries/page.queries';

export default () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState({});
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
    const { id, title } = selectedPage;
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
        <Tabler
          heading={'List of Pages'}
          itemsLoaded={
            isLoaded && !queryLoading && networkStatus !== NetworkStatus.refetch
          }
          emptyMessage={'No pages found.'}
          columns={[
            ['#', { centerAlign: true }],
            ['Title'],
            ['Slug'],
            ['Excerpt'],
            ['Content'],
            ['Last Modified']
          ]}
          items={pages.map((page, key) => {
            return [
              [key + 1, { type: TYPE.INDEX }],
              [page.title, { icon: 'heading' }],
              [
                page.slug ? `/${page.slug}` : '',
                { icon: 'link', hideIfEmpty: true }
              ],
              [
                zText.truncateText(page.excerpt, { limit: 30 }),
                { hideOnMobile: true }
              ],
              [
                zText.truncateText(page.content, { limit: 30 }),
                { hideOnMobile: true }
              ],
              [
                zDate.formatDate(parseInt(page.lastModified)),
                { icon: 'clock' }
              ],
              [<LinkButton page={page} key={key} />, { type: TYPE.BUTTON }],
              [<EditButton id={page.id} key={key} />, { type: TYPE.BUTTON }],
              [
                <DeleteButton
                  page={page}
                  key={key}
                  setDeleteModalVisibility={setDeleteModalVisibility}
                  setSelectedPage={setSelectedPage}
                />,
                { type: TYPE.BUTTON }
              ]
            ];
          })}
          distribution={'6% 0.8fr 10% 1fr 1fr 30% 4% 4% 4%'}
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

const LinkButton = ({ page }) => {
  if (page.isEmbed) return true;

  const navigateToLink = () => (location.href = `/${page.slug}`);

  return (
    <InvisibleButton onClick={navigateToLink}>
      <Icon name={'paper-plane'} />
    </InvisibleButton>
  );
};

const EditButton = ({ id }) => {
  const navigateToLink = () => (location.href = `/admin/pages/edit/${id}`);
  return (
    <InvisibleButton onClick={navigateToLink}>
      <Icon name={'pen-alt'} />
    </InvisibleButton>
  );
};

const DeleteButton = ({ page, setDeleteModalVisibility, setSelectedPage }) => {
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
