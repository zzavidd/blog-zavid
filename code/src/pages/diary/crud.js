/* eslint-disable jsdoc/require-returns */
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { zDate } from 'zavid-modules';

import { Diary } from 'lib/classes';
import { setAlert, reportError } from 'components/alert';
import { ConfirmModal } from 'components/modal';
import hooks from 'constants/hooks';
import { OPERATIONS } from 'constants/strings';
import { isValidDiaryEntry } from 'constants/validations';
import DiaryEntryForm from 'lib/helpers/pages/diary/form';
import {
  CREATE_DIARY_QUERY,
  UPDATE_DIARY_QUERY
} from 'private/api/queries/diary.queries';

const DiaryCrud = ({
  diaryEntry: serverDiaryEntry,
  operation,
  latestEntryNumber = 0
}) => {
  const [clientDiaryEntry, setDiaryEntry] = useState({
    id: 0,
    title: '',
    content: '',
    date: new Date(),
    status: Diary.STATUSES.PRIVATE,
    entryNumber: latestEntryNumber + 1
  });
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
  const isCreateOperation = operation === OPERATIONS.CREATE;

  // Determine if diary entry is being published.
  let isPublish = false;
  if (isCreateOperation) {
    isPublish = Diary.isPublish(clientDiaryEntry.status);
  } else {
    isPublish =
      !Diary.isPublish(serverDiaryEntry.status) &&
      Diary.isPublish(clientDiaryEntry.status);
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

/**
 * Builds the payload to send via the request.
 * @param {object} clientDiaryEntry The diary entry from state.
 * @param {boolean} isPublish Indicates if operation is publish.
 * @param {boolean} isCreateOperation Indicates if operation is create or update.
 * @returns {object} The diary entry to submit.
 */
const buildPayload = (clientDiaryEntry, isPublish, isCreateOperation) => {
  const { id, title, content, status, date, entryNumber } = clientDiaryEntry;

  const diaryEntry = {
    title,
    content,
    date: zDate.formatISODate(date),
    status,
    entryNumber: parseInt(entryNumber)
  };

  const payload = { diaryEntry, isPublish };
  if (!isCreateOperation) {
    payload.id = id;
  }

  return payload;
};

/** Return to the admin page. */
const returnToDiaryAdmin = () => {
  location.href = '/admin/diary';
};

DiaryCrud.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default DiaryCrud;
