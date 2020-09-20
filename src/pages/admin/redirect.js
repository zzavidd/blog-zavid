import React from 'react';
import { useDispatch } from 'react-redux';

import { setUser } from 'lib/reducers';

const AuthRedirect = ({ user }) => {
  const dispatch = useDispatch();
  dispatch(setUser(user));
  setTimeout(() => {
    location.href = '/admin';
  }, 2000);
  return '';
};

AuthRedirect.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default AuthRedirect;
