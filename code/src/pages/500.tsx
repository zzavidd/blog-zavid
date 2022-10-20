import type { NextPageWithLayout } from 'constants/types';
import Layout from 'fragments/Layout';
import ErrorStyle from 'stylesv2/Pages/Error.styles';

// eslint-disable-next-line react/function-component-definition
const Custom500Page: NextPageWithLayout = () => {
  return (
    <ErrorStyle.Container>
      <ErrorStyle.Main>
        <ErrorStyle.Text>Yikes. We seem to have a problem.</ErrorStyle.Text>
        <ErrorStyle.Text>
          Try refreshing the page. If that didn&#39;t work, please bear with me
          and try again later.
        </ErrorStyle.Text>
      </ErrorStyle.Main>
    </ErrorStyle.Container>
  );
};

Custom500Page.getLayout = Layout.addPartials;
export default Custom500Page;
