import React from 'react';

namespace Contexts {
  export const Alerts = React.createContext<Contexts.AlertsProps>({
    alerts: [],
    success: () => {},
    error: () => {},
    report: () => {},
    set: () => {},
    remove: () => {},
  });

  export const Navigation = React.createContext<NavigationProps>([
    false,
    () => {},
  ]);

  export const Snacks = React.createContext<Contexts.SnacksProps>({
    snacks: [],
    add: () => {},
    remove: () => {},
  });

  export interface AlertsProps {
    alerts: AlertDefinition[];
    success(message: string): void;
    error(message: string): void;
    report(message: string, shouldBeExplicit?: boolean): void;
    set(alert: AlertDefinition): void;
    remove(index: number): void;
  }

  export type NavigationProps = [boolean, (isOpen: boolean) => void];

  export interface SnacksProps {
    snacks: SnackDefinition[];
    add(snack: SnackDefinition): void;
    remove(index: number): void;
  }
}

export default Contexts;
