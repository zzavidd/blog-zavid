import type { CustomError } from 'classes';

export function debug(err: Error | unknown) {
  throw err;
}

export const ERRORS = {
  NO_ENTITY: (entity: string) => {
    const error: CustomError = new Error(`No such ${entity} exists.`);
    error.status = 404;
    return error;
  },
  NONEXISTENT_ID: (id: number, entity: string) => {
    const error: CustomError = new Error(
      `There exists no ${entity} with ID '${id}'.`
    );
    return error;
  }
};
