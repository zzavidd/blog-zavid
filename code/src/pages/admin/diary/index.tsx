import { useState } from 'react';

import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import DiaryAdmin from 'fragments/Pages/Diary/DiaryAdmin/DiaryAdmin';
import {
  DiaryAdminContext,
  InitialDiaryAdminState,
} from 'fragments/Pages/Diary/DiaryAdmin/DiaryAdmin.context';

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
