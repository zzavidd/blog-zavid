import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { zDate, zText } from 'zavid-modules';
import { DiaryDAO } from '../../../classes';

import { alert, reportError } from 'src/components/alert';
import { AdminButton, InvisibleButton } from 'src/components/button';
import { Icon } from 'src/components/icon';
import { Spacer, Toolbar } from 'src/components/layout';
import { ConfirmModal } from 'src/components/modal';
import Tabler, {
  TablerColumnHeader,
  TablerItemField,
  TablerType
} from 'src/components/tabler';
import { VanillaLink } from 'src/components/text';
import { ORDER } from 'src/constants/strings';
import {
  GET_DIARY_QUERY,
  DELETE_DIARY_QUERY
} from 'src/private/api/queries/diary.queries';

export default () => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [selectedDiaryEntry, setSelectedDiaryEntry] = useState({} as DiaryDAO);
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
            new TablerColumnHeader('#', { centerAlign: true }),
            new TablerColumnHeader('Date'),
            new TablerColumnHeader('Title'),
            new TablerColumnHeader('Status'),
            new TablerColumnHeader('Content')
          ]}
          items={diaryEntries.map((diaryEntry: DiaryDAO, key: number) => {
            const content = zText.truncateText(diaryEntry.content, {
              limit: 20
            });
            const date = zDate.formatDate(parseInt(diaryEntry.date as string), {
              withWeekday: true
            });
            return [
              new TablerItemField(key + 1, {
                type: TablerType.INDEX
              }),
              new TablerItemField(date, {
                icon: 'calendar-alt'
              }),
              new TablerItemField(diaryEntry.title, { icon: 'heading' }),
              new TablerItemField(diaryEntry.status, { icon: 'lock' }),
              new TablerItemField(content, { hideOnMobile: true }),
              new TablerItemField(
                <LinkButton diaryEntry={diaryEntry} key={key} />,
                { type: TablerType.BUTTON }
              ),
              new TablerItemField(<EditButton id={diaryEntry.id} key={key} />, {
                type: TablerType.BUTTON
              }),
              new TablerItemField(
                (
                  <DeleteButton
                    diaryEntry={diaryEntry}
                    key={key}
                    setDeleteModalVisibility={setDeleteModalVisibility}
                    setSelectedDiaryEntry={setSelectedDiaryEntry}
                  />
                ),
                { type: TablerType.BUTTON }
              )
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
          parseInt(selectedDiaryEntry.date as string),
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