import type { GetStaticProps } from 'next';
import { useState } from 'react';

import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import AnnounceForm from 'fragments/Pages/Subscribe/Announce/AnnounceForm';
import {
  AnnounceFormContext,
  InitialAnnounceFormState,
} from 'fragments/Pages/Subscribe/Announce/AnnounceForm.context';

const SubscriberAnnounce: NextPageWithLayout = () => {
  const context = useState(InitialAnnounceFormState);
  return (
    <AdminGateway>
      <AnnounceFormContext.Provider value={context}>
        <AnnounceForm />
      </AnnounceFormContext.Provider>
    </AdminGateway>
  );
};

export const getStaticProps: GetStaticProps<AppPageProps> = () => {
  return {
    props: {
      pathDefinition: {
        title: 'Send Announcement',
      },
    },
  };
};

SubscriberAnnounce.getLayout = Layout.addPartials;
export default SubscriberAnnounce;
