import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { zDate, zText } from 'zavid-modules';

import { alert, reportError } from 'components/alert';
import { AdminButton, InvisibleButton } from 'components/button';
import { Icon } from 'components/icon';
import { Spacer, Toolbar } from 'components/layout';
import { ConfirmModal } from 'components/modal';
import Tabler, { TYPE } from 'components/tabler';
import { VanillaLink } from 'components/text';
import { ORDER } from 'constants/strings';
import {
  GET_DIARY_QUERY,
  DELETE_DIARY_QUERY
} from 'private/api/queries/diary.queries';

export default () => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [selectedDiaryEntry, setSelectedDiaryEntry] = useState({});
  const [isLoaded, setLoaded] = useState(false);
  const [deleteModalVisible, setDeleteModalVisibility] = useState(false);

  const {
    data,
    error: queryError,
    loading: queryLoading,
    refetch,
    networkStatus
  } = useQuery(GET_DIARY_QUERY, {
    variables: {
      sort: {
        field: 'date',
        order: ORDER.DESCENDING
      }
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });
  const [deleteDiaryEntryMutation] = useMutation(DELETE_DIARY_QUERY);

  useEffect(() => {
    if (networkStatus === NetworkStatus.refetch) return;
    if (queryLoading) return;
    if (queryError) alert.error(queryError);

    setDiaryEntries(data ? data.diaryEntries : []);
    setLoaded(true);
  }, [queryLoading, networkStatus]);

  const deleteDiaryEntry = () => {
    const { id, date } = selectedDiaryEntry;
    Promise.resolve()
      .then(() => deleteDiaryEntryMutation({ variables: { id } }))
      .then(() => {
        alert.success(
          `You've deleted the diary entry for ${zDate.formatDate(date, {
            withWeekday: true
          })}.`
        );
        setDeleteModalVisibility(false);
        refetch();
      })
      .catch(reportError);
  };

  return (
    <>
      <Spacer>
        <Tabler
          heading={'List of Diary Entries'}
          itemsLoaded={
            isLoaded && !queryLoading && networkStatus !== NetworkStatus.refetch
          }
          emptyMessage={'No diary entries found.'}
          columns={[
            ['#', { centerAlign: true }],
            ['Date'],
            ['Title'],
            ['Status'],
            ['Content']
          ]}
          items={diaryEntries.map((diaryEntry, key) => {
            return [
              [key + 1, { type: TYPE.INDEX }],
              [
                zDate.formatDate(parseInt(diaryEntry.date), {
                  withWeekday: true
                }),
                { icon: 'calendar-alt' }
              ],
              [diaryEntry.title, { icon: 'heading' }],
              [diaryEntry.status, { icon: 'lock' }],
              [
                zText.truncateText(diaryEntry.content, { limit: 20 }),
                { hideOnMobile: true }
              ],
              [
                <LinkButton diaryEntry={diaryEntry} key={key} />,
                { type: TYPE.BUTTON }
              ],
              [
                <EditButton id={diaryEntry.id} key={key} />,
                { type: TYPE.BUTTON }
              ],
              [
                <DeleteButton
                  diaryEntry={diaryEntry}
                  key={key}
                  setDeleteModalVisibility={setDeleteModalVisibility}
                  setSelectedDiaryEntry={setSelectedDiaryEntry}
                />,
                { type: TYPE.BUTTON }
              ]
            ];
          })}
          distribution={'6% 20% 1fr 10% 30% 4% 4% 4%'}
        />
        <Toolbar>
          <AdminButton onClick={navigateToCreateForm}>
            Add New Entry
          </AdminButton>
        </Toolbar>
      </Spacer>
      <ConfirmModal
        visible={deleteModalVisible}
        message={`Are you sure you want to delete the diary entry for **${zDate.formatDate(
          parseInt(selectedDiaryEntry.date),
          { withWeekday: true }
        )}**?`}
        confirmFunction={deleteDiaryEntry}
        confirmText={'Delete'}
        closeFunction={() => setDeleteModalVisibility(false)}
      />
    </>
  );
};

const navigateToCreateForm = () => {
  location.href = '/admin/diary/add';
};

const LinkButton = ({ diaryEntry }) => {
  return (
    <VanillaLink href={`/diary/${diaryEntry.slug}`}>
      <Icon name={'paper-plane'} />
    </VanillaLink>
  );
};

const EditButton = ({ id }) => {
  const navigateToLink = () => (location.href = `/admin/diary/edit/${id}`);
  return (
    <InvisibleButton onClick={navigateToLink}>
      <Icon name={'pen-alt'} />
    </InvisibleButton>
  );
};

const DeleteButton = ({
  diaryEntry,
  setDeleteModalVisibility,
  setSelectedDiaryEntry
}) => {
  const attemptDelete = () => {
    setDeleteModalVisibility(true);
    setSelectedDiaryEntry(diaryEntry);
  };

  return (
    <InvisibleButton onClick={attemptDelete}>
      <Icon name={'trash'} />
    </InvisibleButton>
  );
};