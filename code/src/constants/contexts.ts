import React from 'react';

import type { AlertDefinition, SnackDefinition } from './types';

namespace Contexts {
  export const Alerts = React.createContext<{
    alerts: AlertDefinition[];
    success(message: string): void;
    error(message: string): void;
    report(message: string, shouldBeExplicit?: boolean): void;
    set(alert: AlertDefinition): void;
    remove(index: number): void;
  }>({
    alerts: [],
    success: () => {},
    error: () => {},
    report: () => {},
    set: () => {},
    remove: () => {},
  });

  export const Snacks = React.createContext<{
    snacks: SnackDefinition[];
    add(snack: SnackDefinition): void;
    remove(index: number): void;
  }>({
    snacks: [],
    add: () => {},
    remove: () => {},
  });
}

export default Contexts;
