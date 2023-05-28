import { useState } from 'react';

import AdminGateway from 'fragments/AdminGateway';
import DiaryAdmin from 'fragments/diary/DiaryAdmin';
import {
  DiaryAdminContext,
  InitialDiaryAdminState,
} from 'fragments/diary/DiaryAdmin.context';
import Layout from 'fragments/Layout';

const DiaryAdminPage: NextPageWithLayout = () => {
  const [state, setState] = useState(InitialDiaryAdminState);

  return (
    <AdminGateway>
      <DiaryAdminContext.Provider value={[state, setState]}>
        <DiaryAdmin />
      </DiaryAdminContext.Provider>
    </AdminGateway>
  );
};

DiaryAdminPage.getLayout = Layout.addPartials;
export default DiaryAdminPage;
