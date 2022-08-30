import type { GetStaticProps, NextPage } from 'next';

// eslint-disable-next-line react/function-component-definition
const AuthFallback: NextPage = () => {
  return null;
};

export const getStaticProps: GetStaticProps = () => {
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default AuthFallback;
