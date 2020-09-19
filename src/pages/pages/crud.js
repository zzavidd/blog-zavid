/* eslint-disable jsdoc/require-returns */
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';

import { setAlert, reportError } from 'components/alert';
import hooks from 'constants/hooks';
import { OPERATIONS } from 'constants/strings';
import { isValidPage } from 'constants/validations';
import PageForm from 'lib/helpers/pages/pages/form';
import {
  CREATE_PAGE_QUERY,
  UPDATE_PAGE_QUERY
} from 'private/api/queries/page.queries';

const PageCrud = ({ page: serverPage, operation }) => {
  const [clientPage, setPage] = useState({
    id: 0,
    title: '',
    content: '',
    slug: '',
    excerpt: '',
    isEmbed: false
  });
  const [isLoaded, setLoaded] = useState(false);
  const [isRequestPending, setRequestPending] = useState(false);

  // Initialise mutation functions.
  const [createPageMutation, { loading: createLoading }] = useMutation(
    CREATE_PAGE_QUERY
  );
  const [updatePageMutation, { loading: updateLoading }] = useMutation(
    UPDATE_PAGE_QUERY
  );

  // Determine operation type.
  const isCreateOperation = operation === OPERATIONS.CREATE;

  /** Populate the form with page details. */
  const populateForm = () => {
    if (isCreateOperation) return;
    setPage(serverPage);
  };

  useEffect(() => {
    populateForm();
    setLoaded(true);
  }, [isLoaded]);

  useEffect(() => {
    setRequestPending(createLoading || updateLoading);
  }, [createLoading, updateLoading]);

  /** Create new page on server. */
  const submitPage = () => {
    if (!isValidPage(clientPage)) return false;

    const variables = buildPayload(clientPage, true);
    Promise.resolve()
      .then(() => createPageMutation({ variables }))
      .then(() => {
        setAlert({
          type: 'success',
          message: `You've successfully added a new page.`
        });
        returnToPageAdmin();
      })
      .catch(reportError);
  };

  /** Update page on server. */
  const updatePage = () => {
    if (!isValidPage(clientPage)) return false;

    const variables = buildPayload(clientPage, false);
    Promise.resolve()
      .then(() => updatePageMutation({ variables }))
      .then(() => {
        setAlert({
          type: 'success',
          message: `You've successfully updated the ${clientPage.title} page.`
        });
        returnToPageAdmin();
      })
      .catch(reportError);
  };

  return (
    <PageForm
      isLoaded={isLoaded}
      page={clientPage}
      handlers={hooks(setPage, clientPage)}
      confirmFunction={isCreateOperation ? submitPage : updatePage}
      confirmButtonText={isCreateOperation ? 'Submit' : 'Update'}
      cancelFunction={returnToPageAdmin}
      isRequestPending={isRequestPending}
    />
  );
};

/**
 * Builds the payload to send via the request.
 * @param {object} clientPage The page from state.
 * @param {boolean} isCreateOperation Indicates if operation is create or update.
 * @returns {object} The page to submit.
 */
const buildPayload = (clientPage, isCreateOperation) => {
  const { id, title, content, slug, excerpt, isEmbed } = clientPage;

  const page = {
    title: title.trim(),
    content: content.trim(),
    slug: slug.trim(),
    excerpt: excerpt.trim(),
    isEmbed: new Boolean(isEmbed)
  };

  const payload = { page };
  if (!isCreateOperation) {
    payload.id = id;
  }

  return payload;
};

/** Return to the admin page. */
const returnToPageAdmin = () => {
  location.href = '/admin/pages';
};

PageCrud.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default PageCrud;
