import { useMutation } from '@apollo/client';
import type { NextPageContext } from 'next';
import React, { useEffect, useState } from 'react';
import { zDate, zString } from 'zavid-modules';

import { AlertType, reportError, setAlert } from 'src/components/alert';
import { ConfirmModal } from 'src/components/modal';
import hooks from 'src/lib/hooks';
import DiaryEntryForm from 'src/lib/pages/diary/form';
import { DAOParse, NumberParse } from 'src/lib/parser';
import { isValidDiaryEntry } from 'src/lib/validations';
import {
  CREATE_DIARY_QUERY,
  UPDATE_DIARY_QUERY,
} from 'src/private/api/queries/diary.queries';
import { domain } from 'src/settings';

import type { DiaryDAO } from '../../../classes';
import {
  DiaryEntryBuilder,
  DiaryStatic,
  DiaryStatus,
  Operation,
} from '../../../classes';

const DiaryCrud = ({
  diaryEntry: serverDiaryEntry,
  operation,
  latestEntryNumber = 0,
}: DiaryInitialProps) => {
  const [clientDiaryEntry, setDiaryEntry] = useState({
    id: 0,
    title: '',
    content: '',
    footnote: '',
    date: new Date(),
    status: DiaryStatus.PROTECTED,
    entryNumber: latestEntryNumber + 1,
    isFavourite: false,
    tags: '',
  } as DiaryDAO);
  const [isLoaded, setLoaded] = useState(true);
  const [isRequestPending, setRequestPending] = useState(false);
  const [isPublishModalVisible, setPublishModalVisibility] = useState(false);

  // Initialise mutation functions.
  const [createDiaryEntryMutation, { loading: createLoading }] =
    useMutation(CREATE_DIARY_QUERY);
  const [updateDiaryEntryMutation, { loading: updateLoading }] =
    useMutation(UPDATE_DIARY_QUERY);

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

    // Convert tags to CSV string.
    if (serverDiaryEntry.tags) {
      const tags = JSON.parse(serverDiaryEntry.tags as string) || [];
      serverDiaryEntry.tags = zString.convertArrayToCsv(tags);
    }

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
        message: `You've successfully added a new diary entry.`,
      });
      returnToDiaryAdmin();
    } catch (err) {
      return reportError(err as Error);
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
          clientDiaryEntry.date!,
        )}.`,
      });
      returnAfterUpdate(clientDiaryEntry.entryNumber!);
    } catch (err) {
      return reportError(err as Error);
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
  isCreateOperation: boolean,
): DiaryRequest => {
  const {
    id,
    title,
    content,
    footnote,
    status,
    date,
    entryNumber,
    isFavourite,
    tags,
  } = clientDiaryEntry;

  const diaryEntry = new DiaryEntryBuilder()
    .withTitle(title)
    .withContent(content)
    .withFootnote(footnote)
    .withDate(zDate.formatISODate(date!))
    .withStatus(status)
    .withEntryNumber(entryNumber)
    .setIsFavourite(isFavourite)
    .withTags(zString.convertCsvToArray(tags as string))
    .build();

  const payload: DiaryRequest = { diaryEntry, isPublish };

  if (!isCreateOperation) {
    payload.id = id;
  }

  return payload;
};

/** Return to the admin page. */
const returnToDiaryAdmin = () => {
  location.href = '/admin/diary';
};

const returnAfterUpdate = (entryNumber: number) => {
  const pageUrl = `${domain}/diary/${entryNumber}`;
  if (document.referrer === pageUrl) {
    location.href = pageUrl;
  } else {
    returnToDiaryAdmin();
  }
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
