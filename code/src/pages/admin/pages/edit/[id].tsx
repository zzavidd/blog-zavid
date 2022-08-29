import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import type { PageDAO } from 'classes';
import { AlertType, reportError, setAlert } from 'components/alert';
import type { PathDefinition } from 'constants/paths';
import * as Utils from 'constants/utils';
import PageMetadata from 'fragments/PageMetadata';
import PageForm, { buildPayload } from 'fragments/pages/PageForm';
import { UIError } from 'lib/errors';
import hooks from 'lib/hooks';
import { validatePage } from 'lib/validations';
import { getPageByIdSSR } from 'pages/api/pages';

function PageEdit({ pathDefinition, pageProps }: PageEditProps) {
  const { page: serverPage } = pageProps;
  const [clientPage, setPage] = useState<PageDAO>(serverPage);
  const [isRequestPending, setRequestPending] = useState(false);

  const router = useRouter();

  /** Update page on server. */
  async function updatePage() {
    try {
      validatePage(clientPage);
      setRequestPending(true);

      const payload = buildPayload(clientPage, false);
      await Utils.request('/api/pages', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setAlert({
        type: AlertType.SUCCESS,
        message: `You've successfully updated the ${clientPage.title} page.`,
      });
      returnToPageAdmin();
    } catch (e: any) {
      reportError(e.message, e instanceof UIError);
    } finally {
      setRequestPending(false);
    }
  }

  function returnToPageAdmin() {
    void router.push('/admin/pages');
  }

  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <PageForm
        page={clientPage}
        handlers={hooks(setPage, clientPage)}
        confirmFunction={updatePage}
        confirmButtonText={'Update'}
        cancelFunction={returnToPageAdmin}
        isRequestPending={isRequestPending}
      />
    </React.Fragment>
  );
}

export const getServerSideProps: GetServerSideProps<PageEditProps> = async ({
  query,
}) => {
  const page = JSON.parse(await getPageByIdSSR(parseInt(query.id as string)));
  return {
    props: {
      pathDefinition: {
        title: 'List of Pages',
      },
      pageProps: {
        page,
      },
    },
  };
};

export default PageEdit;

interface PageEditProps {
  pathDefinition: PathDefinition;
  pageProps: {
    page: PageDAO;
  };
}
