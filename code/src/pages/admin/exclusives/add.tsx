import type { GetStaticProps } from 'next';
import { useState } from 'react';

import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import ExclusiveForm from 'fragments/Pages/Exclusives/ExclusiveForm';
import {
  ExclusiveFormContext,
  InitialExclusiveFormState,
} from 'fragments/Pages/Exclusives/ExclusiveForm.context';

const ExclusiveAdd: NextPageWithLayout = () => {
  const context = useState(InitialExclusiveFormState);
  return (
    <AdminGateway>
      <ExclusiveFormContext.Provider value={context}>
        <ExclusiveForm />
      </ExclusiveFormContext.Provider>
    </AdminGateway>
  );
};

export const getStaticProps: GetStaticProps<AppPageProps> = () => {
  return {
    props: {
      pathDefinition: {
        title: 'Create Exclusive',
      },
    },
  };
};

ExclusiveAdd.getLayout = Layout.addPartials;
export default ExclusiveAdd;
