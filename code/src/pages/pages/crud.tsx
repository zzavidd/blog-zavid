import { useMutation } from '@apollo/client';
import { Operation, PageDAO } from 'classes';
import { PageBuilder } from 'classes/builders/entity/page.builder';
import { NextPageContext } from 'next';
import React, { useEffect, useState } from 'react';

import { setAlert, reportError, AlertType } from 'src/components/alert';
import hooks from 'src/constants/hooks';
import { isValidPage } from 'src/constants/validations';
import PageForm from 'src/lib/helpers/pages/pages/form';
import {
  CREATE_PAGE_QUERY,
  UPDATE_PAGE_QUERY
} from 'src/private/api/queries/page.queries';

const PageCrud = ({ page: serverPage, operation }: PageCrud) => {
  const [clientPage, setPage] = useState({
    id: 0,
    title: '',
    content: '',
    slug: '',
    excerpt: '',
    isEmbed: false
  } as PageDAO);
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
  const isCreateOperation = operation === Operation.CREATE;

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
          type: AlertType.SUCCESS,
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
          type: AlertType.SUCCESS,
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

const buildPayload = (
  clientPage: PageDAO,
  isCreateOperation: boolean
): PageRequestPayload => {
  const { id, title, content, slug, excerpt, isEmbed } = clientPage;

  const page = new PageBuilder()
    .withTitle(title)
    .withContent(content)
    .withExcerpt(excerpt)
    .withSlug(slug)
    .setIsEmbed(isEmbed)
    .build();

  const payload: PageRequestPayload = { page };
  if (!isCreateOperation) {
    payload.id = id;
  }

  return payload;
};

/** Return to the admin page. */
const returnToPageAdmin = () => {
  location.href = '/admin/pages';
};

PageCrud.getInitialProps = async ({ query }: NextPageContext) => {
  return { ...query };
};

export default PageCrud;

interface PageCrud {
  page: PageDAO;
  operation: Operation;
}

interface PageRequestPayload {
  id?: number;
  page: PageDAO;
}
