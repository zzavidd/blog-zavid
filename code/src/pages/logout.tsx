import type { GetServerSideProps, NextPage } from 'next';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { AppActions } from 'constants/reducers';

// eslint-disable-next-line react/function-component-definition
const Logout: NextPage = () => {
  const appDispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await signOut({ redirect: false });
      appDispatch(AppActions.setLoginSnackShown(false));
      router.back();
    })();
  }, [appDispatch, router]);

  return null;
};

// eslint-disable-next-line require-await
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('X-Robots-Tag', 'noindex');
  return { props: {} };
};

export default Logout;
