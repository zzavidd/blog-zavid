import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import type { PageDAO } from 'classes/pages/PageDAO';
import Alert, { AlertType } from 'constants/alert';
import hooks from 'constants/handlers';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import Utils from 'constants/utils';
import Validate from 'constants/validations';
import Layout from 'fragments/Layout';
import PageMetadata from 'fragments/PageMetadata';
import PageForm, { buildPayload } from 'fragments/pages/PageForm';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';

// eslint-disable-next-line react/function-component-definition
const PageAdd: NextPageWithLayout<PageAddProps> = ({ pathDefinition }) => {
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
      Validate.page(clientPage);
      setRequestPending(true);

      const payload = buildPayload(clientPage, true);
      await Utils.request('/api/pages', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      Alert.set({
        type: AlertType.SUCCESS,
        message: "You've successfully added a new page.",
      });
      returnToPageAdmin();
    } catch (e: any) {
      Alert.error(e.message);
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

PageAdd.getLayout = Layout.addHeaderOnly;
export default PageAdd;

interface PageAddProps {
  pathDefinition: PathDefinition;
}
