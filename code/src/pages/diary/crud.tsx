import { useMutation } from '@apollo/client';
import { NextPageContext } from 'next';
import React, { useEffect, useState } from 'react';
import { zDate } from 'zavid-modules';

import { AlertType, reportError, setAlert } from 'src/components/alert';
import { ConfirmModal } from 'src/components/modal';
import hooks from 'src/constants/hooks';
import { isValidDiaryEntry } from 'src/constants/validations';
import DiaryEntryForm from 'src/lib/helpers/pages/diary/form';
import { DAOParse, NumberParse } from 'src/lib/parser';
import {
  CREATE_DIARY_QUERY,
  UPDATE_DIARY_QUERY
} from 'src/private/api/queries/diary.queries';

import {
  DiaryDAO,
  DiaryStatic,
  DiaryStatus,
  Operation
} from '../../../classes';

const DiaryCrud = ({
  diaryEntry: serverDiaryEntry,
  operation,
  latestEntryNumber = 0
}: DiaryInitialProps) => {
  const [clientDiaryEntry, setDiaryEntry] = useState({
    id: 0,
    title: '',
    content: '',
    date: new Date(),
    status: DiaryStatus.PRIVATE,
    entryNumber: latestEntryNumber + 1
  } as DiaryDAO);
  const [isLoaded, setLoaded] = useState(true);
  const [isRequestPending, setRequestPending] = useState(false);
  const [isPublishModalVisible, setPublishModalVisibility] = useState(false);

  // Initialise mutation functions.
  const [createDiaryEntryMutation, { loading: createLoading }] = useMutation(
    CREATE_DIARY_QUERY
  );
  const [updateDiaryEntryMutation, { loading: updateLoading }] = useMutation(
    UPDATE_DIARY_QUERY
  );

  // Determine operation type.
  const isCreateOperation = operation === Operation.CREATE;

  // Determine if diary entry is being published.
  let isPublish = false;
  if (isCreateOperation) {
    isPublish = DiaryStatic.isPublish(clientDiaryEntry);
  } else {
    isPublish =
      !DiaryStatic.isPublish(serverDiaryEntry) &&
      DiaryStatic.isPublish(clientDiaryEntry);
  }

  /** Populate the form with diary entry details. */
  const populateForm = () => {
    if (isCreateOperation) return;
    setDiaryEntry(serverDiaryEntry);
  };

  useEffect(() => {
    populateForm();
    setLoaded(true);
  }, [isLoaded]);

  useEffect(() => {
    setRequestPending(createLoading || updateLoading);
  }, [createLoading, updateLoading]);

  /** Create new diary entry on server. */
  const submitDiaryEntry = async (): Promise<void> => {
    if (!isValidDiaryEntry(clientDiaryEntry)) return;

    const variables = buildPayload(clientDiaryEntry, isPublish, true);
    try {
      await createDiaryEntryMutation({ variables });
      setAlert({
        type: AlertType.SUCCESS,
        message: `You've successfully added a new diary entry.`
      });
      returnToDiaryAdmin();
    } catch (err) {
      return reportError(err);
    }
  };

  /** Update diary entry on server. */
  const updateDiaryEntry = async (): Promise<void> => {
    if (!isValidDiaryEntry(clientDiaryEntry)) return;

    const variables = buildPayload(clientDiaryEntry, isPublish, false);
    try {
      await updateDiaryEntryMutation({ variables });
      setAlert({
        type: AlertType.SUCCESS,
        message: `You've successfully updated the diary entry for ${zDate.formatDate(
          clientDiaryEntry.date!
        )}.`
      });
      returnToDiaryAdmin();
    } catch (err) {
      return reportError(err);
    }
  };

  const confirmText = `${isCreateOperation ? 'Submit' : 'Update'}${
    isPublish ? ' & Publish' : ''
  }`;
  const absoluteConfirm = isCreateOperation
    ? submitDiaryEntry
    : updateDiaryEntry;
  const confirmFunction = isPublish
    ? () => setPublishModalVisibility(true)
    : absoluteConfirm;

  return (
    <>
      <DiaryEntryForm
        isLoaded={isLoaded}
        diaryEntry={clientDiaryEntry}
        handlers={hooks(setDiaryEntry, clientDiaryEntry)}
        confirmFunction={confirmFunction}
        confirmButtonText={confirmText}
        cancelFunction={returnToDiaryAdmin}
        isRequestPending={isRequestPending}
      />
      <ConfirmModal
        visible={isPublishModalVisible}
        message={
          "By publishing this diary entry, you'll be notifying all subscribers of this new release. Confirm that you want to publish."
        }
        confirmFunction={absoluteConfirm}
        confirmText={'Confirm'}
        closeFunction={() => setPublishModalVisibility(false)}
      />
    </>
  );
};

// TODO: Use DiaryEntryBuilder
const buildPayload = (
  clientDiaryEntry: DiaryDAO,
  isPublish: boolean,
  isCreateOperation: boolean
): DiaryRequest => {
  const { id, title, content, status, date, entryNumber } = clientDiaryEntry;

  const diaryEntry: DiaryDAO = {
    title,
    content,
    date: zDate.formatISODate(date!),
    status,
    entryNumber
  };

  const payload: DiaryRequest = { diaryEntry, isPublish };

  if (!isCreateOperation) {
    payload.id = id;
  }

  return payload;
};

/** Return to the admin page. */
const returnToDiaryAdmin = (): void => {
  location.href = '/admin/diary';
};

DiaryCrud.getInitialProps = async ({ query }: NextPageContext) => {
  const diaryEntry = DAOParse<DiaryDAO>(query.diaryEntry);
  const operation = query.operation as Operation;
  const latestEntryNumber = NumberParse(query.latestEntryNumber);
  return { diaryEntry, operation, latestEntryNumber };
};

export default DiaryCrud;

type DiaryInitialProps = {
  diaryEntry: DiaryDAO;
  latestEntryNumber?: number;
  operation: Operation;
};

type DiaryRequest = {
  id?: number;
  diaryEntry: DiaryDAO;
  isPublish: boolean;
};
