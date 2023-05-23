import React from 'react';

export const NavigationContext = React.createContext<NavigationContextProps>([
  false,
  () => {},
]);

export type NavigationContextProps = [boolean, (isOpen: boolean) => void];
