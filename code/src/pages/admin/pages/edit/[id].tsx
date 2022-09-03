import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import type { PageDAO } from 'classes';
import { AlertType, reportError, setAlert } from 'components/alert';
import { UIError } from 'constants/errors';
import hooks from 'constants/handlers';
import type { PathDefinition } from 'constants/types';
import * as Utils from 'constants/utils';
import { validatePage } from 'constants/validations';
import PageMetadata from 'fragments/PageMetadata';
import PageForm, { buildPayload } from 'fragments/pages/PageForm';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import SSR from 'private/ssr';

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
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  const page = JSON.parse(
    await SSR.Pages.getById(parseInt(query.id as string)),
  );
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
