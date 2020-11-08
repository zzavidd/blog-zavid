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

export type ReactChangeEvent = React.ChangeEvent<HTMLInputElement>;