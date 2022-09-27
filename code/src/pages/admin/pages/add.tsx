import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import type { PageDAO } from 'classes/pages/PageDAO';
import Alert, { AlertType } from 'constants/alert';
import hooks from 'constants/handlers';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import Utils from 'constants/utils';
import Validate from 'constants/validations';
import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import PageMetadata from 'fragments/PageMetadata';
import PageForm, { buildPayload } from 'fragments/pages/PageForm';

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
    <AdminGateway>
      <PageMetadata {...pathDefinition} />
      <PageForm
        page={clientPage}
        handlers={hooks(setPage, clientPage)}
        confirmFunction={submitPage}
        confirmButtonText={'Submit'}
        cancelFunction={returnToPageAdmin}
        isRequestPending={isRequestPending}
      />
    </AdminGateway>
  );
};

export const getStaticProps: GetStaticProps<PageAddProps> = () => {
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
