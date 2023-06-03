import { useState } from 'react';

import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import SubscriberAdmin from 'fragments/Pages/Subscribe/SubscriberAdmin/SubscriberAdmin';
import {
  InitialSubscriberAdminState,
  SubscriberAdminContext,
} from 'fragments/Pages/Subscribe/SubscriberAdmin/SubscriberAdmin.context';

const SubscriberAdminPage: NextPageWithLayout = () => {
  const context = useState(InitialSubscriberAdminState);
  return (
    <AdminGateway>
      <SubscriberAdminContext.Provider value={context}>
        <SubscriberAdmin />
      </SubscriberAdminContext.Provider>
    </AdminGateway>
  );
};

SubscriberAdminPage.getLayout = Layout.addPartials;
export default SubscriberAdminPage;
