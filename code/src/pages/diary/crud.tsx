/* eslint-disable jsdoc/require-returns */
import { useMutation } from '@apollo/client';
import {
  DiaryDAO,
  DiaryStatic,
  Operation,
  DiaryStatus
} from '../../../classes';
import React, { useEffect, useState } from 'react';
import { NextPageContext } from 'next';

const { setAlert, reportError } = require('../../components/alert');
const { ConfirmModal } = require('../../components/modal');
import hooks from '../../constants/hooks';
const { isValidDiaryEntry } = require('../../constants/validations');
const DiaryEntryForm = require('../../lib/helpers/pages/diary/form');
const {
  CREATE_DIARY_QUERY,
  UPDATE_DIARY_QUERY
} = require('../../private/api/queries/diary.queries');

const { zDate } = require('zavid-modules');

interface DiaryInitialProps {
  diaryEntry: DiaryDAO;
  latestEntryNumber?: number;
  operation: Operation;
}

interface DiaryRequest {
  id?: number;
  diaryEntry: DiaryDAO;
  isPublish: boolean;
}

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
  const submitDiaryEntry = () => {
    if (!isValidDiaryEntry(clientDiaryEntry)) return false;

    const variables = buildPayload(clientDiaryEntry, isPublish, true);
    Promise.resolve()
      .then(() => createDiaryEntryMutation({ variables }))
      .then(() => {
        setAlert({
          type: 'success',
          message: `You've successfully added a new diary entry.`
        });
        returnToDiaryAdmin();
      })
      .catch(reportError);
  };

  /** Update diary entry on server. */
  const updateDiaryEntry = () => {
    if (!isValidDiaryEntry(clientDiaryEntry)) return false;

    const variables = buildPayload(clientDiaryEntry, isPublish, false);
    Promise.resolve()
      .then(() => updateDiaryEntryMutation({ variables }))
      .then(() => {
        setAlert({
          type: 'success',
          message: `You've successfully updated the diary entry for ${zDate.formatDate(
            clientDiaryEntry.date
          )}.`
        });
        returnToDiaryAdmin();
      })
      .catch(reportError);
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

const buildPayload = (
  clientDiaryEntry: DiaryDAO,
  isPublish: boolean,
  isCreateOperation: boolean
): DiaryRequest => {
  const { id, title, content, status, date, entryNumber } = clientDiaryEntry;

  const diaryEntry: DiaryDAO = {
    title,
    content,
    date: zDate.formatISODate(date),
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
  return { ...query };
};

export default DiaryCrud;
