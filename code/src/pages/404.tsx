import Link from 'next/link';
import React from 'react';

import type { NextPageWithLayout } from 'constants/types';
import Layout from 'fragments/Layout';
import ErrorStyle from 'stylesv2/Pages/Error.styles';

// eslint-disable-next-line react/function-component-definition
const Custom404Page: NextPageWithLayout = () => {
  return (
    <ErrorStyle.Container>
      <ErrorStyle.Main>
        <ErrorStyle.Text>
          Not gonna lie, I don&#39;t know who sent you here but the page
          you&#39;re looking for doesn&#39;t exist.
        </ErrorStyle.Text>
        <ErrorStyle.Links>
          <Link href={'/'} passHref={true}>
            <a>Go to Home</a>
          </Link>
        </ErrorStyle.Links>
      </ErrorStyle.Main>
    </ErrorStyle.Container>
  );
};

Custom404Page.getLayout = Layout.addPartials;
export default Custom404Page;
