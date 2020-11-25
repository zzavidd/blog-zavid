import { NextFunction, Request, Response } from 'express';

import { CustomError } from 'classes';

import { getServer } from './singleton';

const isDev = process.env.NODE_ENV !== 'production';
const server = getServer();

const PROD_ERR_MESSAGE = 'A problem occurred. Please try again later!';

export const debug = (err: Error) => {
  throw err;
};

export const renderErrorPage = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.toString());
  const errorPage = err.status === 404 ? '/404' : '/_error';
  const message = isDev ? err.message : PROD_ERR_MESSAGE;
  server.render(req, res, errorPage, { message });
};

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
