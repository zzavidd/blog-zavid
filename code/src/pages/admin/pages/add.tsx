import type { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import type { PageDAO } from 'classes/pages/PageDAO';
import { AlertType, reportError, setAlert } from 'components/alert';
import { UIError } from 'constants/errors';
import hooks from 'constants/handlers';
import type { PathDefinition } from 'constants/types';
import * as Utils from 'constants/utils';
import { validatePage } from 'constants/validations';
import PageMetadata from 'fragments/PageMetadata';
import PageForm, { buildPayload } from 'fragments/pages/PageForm';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';

// eslint-disable-next-line react/function-component-definition
const PageAdd: NextPage<PageAddProps> = ({ pathDefinition }) => {
  const [clientPage, setPage] = useState<PageDAO>({
    title: '',
    content: '',
    slug: '',
    excerpt: '',
    isEmbed: false,
  });
  const [isRequestPending, setRequestPending] = useState(false);

  const router = useRouter();

  /** Create new page on server. */
  async function submitPage() {
    try {
      validatePage(clientPage);
      setRequestPending(true);

      const payload = buildPayload(clientPage, true);
      await Utils.request('/api/pages', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setAlert({
        type: AlertType.SUCCESS,
        message: 'You\'ve successfully added a new page.',
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
        confirmFunction={submitPage}
        confirmButtonText={'Submit'}
        cancelFunction={returnToPageAdmin}
        isRequestPending={isRequestPending}
      />
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps<PageAddProps> = async ({
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

  return {
    props: {
      pathDefinition: {
        title: 'List of Pages',
      },
    },
  };
};

interface PageAddProps {
  pathDefinition: PathDefinition;
}

export default PageAdd;
