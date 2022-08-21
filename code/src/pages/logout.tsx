import type { NextPage } from 'next';
import { signOut } from 'next-auth/react';

import { domain } from 'settings';

// eslint-disable-next-line react/function-component-definition
const Logout: NextPage = () => {
  signOut({ callbackUrl: domain });
  return null;
};

export default Logout;
