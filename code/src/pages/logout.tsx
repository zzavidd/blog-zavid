import type { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { nextAuthOptions } from './api/auth/[...nextauth]';

// eslint-disable-next-line react/function-component-definition
const Logout: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await signOut({ redirect: false });
      router.back();
    })();
  }, []);

  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader('X-Robots-Tag', 'noindex');
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  if (session) {
    return { props: {} };
  } else {
    return { notFound: true };
  }
};

export default Logout;
