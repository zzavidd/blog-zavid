import type { PopoverPosition } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';

export const NavigationContext = React.createContext<NavigationContextProps>([
  false,
  () => {},
]);

export const MenuContext = React.createContext<MenuContextProps>([
  {
    contextMenuVisible: false,
    focusedTextContent: '',
    position: { left: 0, top: 0 },
    title: '',
  },
  () => {},
]);

export interface MenuContextState {
  contextMenuVisible: boolean;
  focusedTextContent: string;
  position: PopoverPosition;
  title: string;
}

export type NavigationContextProps = ReactUseState<boolean>;
export type MenuContextProps = ReactUseState<MenuContextState>;

type ReactUseState<T> = [T, Dispatch<SetStateAction<T>>];
