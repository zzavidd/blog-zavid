import assert from 'assert';
import { Application } from 'express';
import Knex from 'knex';
import Server from 'next/dist/next-server/server/next-server';

let IApp: Application;
let IKnex: Knex;
let IServer: Server;

export const setApp = (instance: Application): void => {
  IApp = instance;
};

export const setKnex = (instance: Knex): void => {
  IKnex = instance;
  console.info('Connected to database.');
};

export const setServer = (instance: Server): void => {
  IServer = instance;
};

export const getApp = (): Application => {
  assert.ok(IApp, 'An application instance has not been initialized.');
  return IApp;
};

export const getKnex = (): Knex => {
  assert.ok(IKnex, 'A Knex instance has not been initialized.');
  return IKnex;
};
export const getServer = (): Server => {
  assert.ok(IServer, 'An server instance has not been initialized.');
  return IServer;
};