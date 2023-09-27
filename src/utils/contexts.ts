import type { PopoverPosition } from '@mui/material';
import React from 'react';

export const NavigationContext = React.createContext<NavigationContextProps>([
  false,
  () => {},
]);

export const InitialMenuState: MenuContextState = {
  contextMenuVisible: false,
  focusedElement: null,
  focusedTextContent: '',
  position: { left: 0, top: 0 },
  info: {
    title: '',
    date: new Date(),
    categories: [],
    entity: '',
  },
};

export const MenuContext = React.createContext<MenuContextProps>([
  InitialMenuState,
  () => {},
]);

export interface MenuContextState {
  contextMenuVisible: boolean;
  focusedElement: HTMLParagraphElement | null;
  focusedTextContent: string;
  position: PopoverPosition;
  info: PageCuratorInfo;
}

export type NavigationContextProps = ReactUseState<boolean>;
export type MenuContextProps = ReactUseState<MenuContextState>;
