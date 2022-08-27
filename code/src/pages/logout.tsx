import type { NextPage } from 'next';
import { signOut } from 'next-auth/react';

import { domain } from 'constants/settings';

// eslint-disable-next-line react/function-component-definition
const Logout: NextPage = () => {
  void signOut({ callbackUrl: domain });
  return null;
};

export default Logout;
