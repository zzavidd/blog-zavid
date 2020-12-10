import { ReactNode } from 'react';

export * from './post.interface';
export * from './diary.interface';
export * from './subscriber.interface';
export * from './page.interface';
export * from './super';

export enum QueryOrder {
  ASCENDING = 'ASC',
  DESCENDING = 'DESC',
  RANDOM = 'RANDOM'
}

export enum Operation {
  CREATE = 'add',
  UPDATE = 'edit'
}

export interface CustomError extends Error {
  status?: number;
}

export interface ReactComponent {
  children?: ReactNode;
  className?: string;
}

export type ReactInputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type ReactTextAreaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
export type ReactSelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
export type ReactHook<T> = React.Dispatch<React.SetStateAction<T>>;

export type OnInputChangeType = (
  event: React.ChangeEvent<HTMLInputElement>
) => void;
export type OnTextAreaChangeType = (
  event: React.ChangeEvent<HTMLTextAreaElement>
) => void;
export type OnClickType = (event: React.MouseEvent<HTMLButtonElement>) => void;
export type OnKeyPressType = (event: React.KeyboardEvent<HTMLInputElement>) => void;
export type OnSelectChangeType = (
  event: React.ChangeEvent<HTMLSelectElement>
) => void;

export interface Substitutions {
  [key: string]: string | number;
}

export interface EditButton {
  id: number;
}
