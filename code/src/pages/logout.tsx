import type { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { signOut } from 'next-auth/react';

import { DOMAIN } from 'constants/settings';

import { nextAuthOptions } from './api/auth/[...nextauth]';

// eslint-disable-next-line react/function-component-definition
const Logout: NextPage = () => {
  void signOut({ callbackUrl: DOMAIN });
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  if (session) {
    return { props: {} };
  } else {
    return { notFound: true };
  }
};

export default Logout;
