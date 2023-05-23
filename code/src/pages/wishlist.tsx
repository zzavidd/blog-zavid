import * as ZIV from '@ziventi/wishlist';
import type { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

import type { AppState } from 'constants/reducers';
import Layout from 'fragments/Layout';
import WL from 'styles/Pages/Wishlist.styles';
import Contexts from 'utils/contexts';

// eslint-disable-next-line react/function-component-definition
const WishlistPage: NextPageWithLayout<WishlistPageProps> = () => {
  const appState = useSelector((state: AppState) => state);
  const { data: session, status } = useSession();
  const email = session?.user?.email;

  const Snacks = useContext(Contexts.Snacks);

  /**
   * Shows snack if user is logged in.
   */
  useEffect(() => {
    if (status !== 'authenticated' || !appState.session.loginSnackShown) return;
    Snacks.add({ message: `Signed in as ${email}.` });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, status]);

  return (
    <ZIV.WishlistProvider>
      <ZIV.WLStyles.Container>
        <ZIV.WLStyles.GridBox>
          <WL.Main.PageDetails>
            <WL.Main.Title>Zavid&#39;s Wishlist</WL.Main.Title>
            <WL.Main.Summary>
              Consider this my own personal purchase log which simultaneously
              serves as a registry for the ones who show love through gifts. The
              idea is to channel your love so that it is both thoughtful and
              well-received. Consider anything on this list nectar to my soul.
              Please note that prices are subject to fluctuation.
            </WL.Main.Summary>
            <WL.Main.SummarySuffix>
              My birthday is the <strong>2nd December</strong>, by the way. 👀
            </WL.Main.SummarySuffix>
            <WL.Main.SummarySuffix>
              Sort Code: 82-68-42
              <br />
              Accountt Number: 20197208
            </WL.Main.SummarySuffix>
          </WL.Main.PageDetails>
          <ZIV.Grid />
        </ZIV.WLStyles.GridBox>
        <ZIV.Tray />
      </ZIV.WLStyles.Container>
    </ZIV.WishlistProvider>
  );
};

export const getServerSideProps: GetServerSideProps<
  WishlistPageProps
  // eslint-disable-next-line require-await
> = async ({ res }) => {
  res.setHeader('X-Robots-Tag', 'noindex');
  return {
    props: {
      pathDefinition: {
        title: "Zavid's Wishlist",
        description: 'Consider anything on this list nectar to my soul.',
        url: '/wishlist',
      },
    },
  };
};

WishlistPage.getLayout = Layout.addHeaderOnly;
export default WishlistPage;

interface WishlistPageProps {
  pathDefinition: PathDefinition;
}
