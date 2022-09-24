import React from 'react';

import type { Snack } from './types';

namespace Contexts {
  export const Snacks = React.createContext<{
    snacks: Snack[];
    add: (snack: Snack) => void;
    remove: (index: number) => void;
  }>({
    snacks: [],
    add: () => {},
    remove: () => {},
  });
}

export default Contexts;
