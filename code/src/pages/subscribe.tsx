import type { GetStaticProps } from 'next';
import { useState } from 'react';

import Layout from 'fragments/Layout';
import SubscribeForm from 'fragments/Subscribe/SubscribeForm';
import {
  InitialSubscribeFormState,
  SubscribeFormContext,
} from 'fragments/Subscribe/SubscribeForm.context';
import Settings from 'utils/settings';

const SubscribePage: NextPageWithLayout<AppPageProps> = () => {
  const [state, setState] = useState(InitialSubscribeFormState);

  return (
    <SubscribeFormContext.Provider value={[state, setState]}>
      <SubscribeForm />
    </SubscribeFormContext.Provider>
  );
};

export const getStaticProps: GetStaticProps<AppPageProps> = () => {
  return {
    props: {
      pathDefinition: {
        title: `Subscribe | ${Settings.SITE_TITLE}`,
        description:
          'Be the first to know when a new post or diary entry drops.',
        url: '/subscribe',
      },
    },
  };
};

SubscribePage.getLayout = Layout.addPartials;
export default SubscribePage;
