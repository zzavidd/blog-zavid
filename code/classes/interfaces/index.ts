export * from './post.interface';
export * from './diary.interface';
export * from './subscriber.interface';

export enum QueryOrder {
  ASCENDING = 'ASC',
  DESCENDING = 'DESC',
  RANDOM = 'RANDOM'
}

export enum Operation {
  CREATE = 'add',
  UPDATE = 'edit'
}

export type ReactInputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type ReactSelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
export type ReactHook<T> = React.Dispatch<React.SetStateAction<T>>;

export type OnInputChangeType = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type OnTextareaChangeType = (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
export type OnClickType = (event: React.MouseEvent<HTMLButtonElement>) => void;
export type OnSelectChangeType = (event: React.ChangeEvent<HTMLSelectElement>) => void;

export interface Substitutions {
  [key: string]: string | number;
}