/* eslint-disable jsdoc/require-returns */
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { zDate } from 'zavid-modules';

import { Diary } from 'classes';
import { alert, setAlert } from 'components/alert';
import hooks from 'constants/hooks';
import { OPERATIONS } from 'constants/strings';
import { isValidDiaryEntry } from 'constants/validations';
import DiaryEntryForm from 'lib/helpers/pages/diary/form';
import {
  CREATE_DIARY_QUERY,
  UPDATE_DIARY_QUERY
} from 'private/api/queries/diary.queries';

const DiaryCrud = ({ diaryEntry: serverDiaryEntry, operation }) => {
  const [clientDiaryEntry, setDiaryEntry] = useState({
    id: 0,
    content: '',
    date: new Date(),
    status: Diary.STATUSES.DRAFT
  });
  const [isLoaded, setLoaded] = useState(true);
  const [isRequestPending, setRequestPending] = useState(false);

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
      .catch(alert.error);
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
          message: `You've successfully updated the diary entry for **${zDate.formatDate(
            clientDiaryEntry.date
          )}**.`
        });
        returnToDiaryAdmin();
      })
      .catch(alert.error);
  };

  return (
    <DiaryEntryForm
      isLoaded={isLoaded}
      diaryEntry={clientDiaryEntry}
      handlers={hooks(setDiaryEntry, clientDiaryEntry)}
      confirmFunction={isCreateOperation ? submitDiaryEntry : updateDiaryEntry}
      confirmButtonText={isCreateOperation ? 'Submit' : 'Update'}
      cancelFunction={returnToDiaryAdmin}
      isRequestPending={isRequestPending}
    />
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
  const { id, content, status, date } = clientDiaryEntry;

  const diaryEntry = {
    content: content.trim(),
    date: zDate.formatISODate(date),
    status
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