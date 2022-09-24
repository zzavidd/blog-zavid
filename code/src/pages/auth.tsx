import type { GetServerSideProps, NextPage } from 'next';

// eslint-disable-next-line react/function-component-definition
const Auth: NextPage = () => {
  return null;
};

// eslint-disable-next-line require-await
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('X-Robots-Tag', 'noindex');
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default Auth;
