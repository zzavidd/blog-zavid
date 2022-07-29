import fs from 'fs';
import path from 'path';

import { GenericDAO } from '../../classes';

export async function tryWrapper<T extends GenericDAO>(callable: Promise<T>) {
  try {
    await callable;
    console.info('Notifications sent successfully.'.green);
  } catch (error) {
    console.error((error as string).red);
  }
}

export function importText(file: string) {
  return fs.readFileSync(path.join(__dirname, `./text/${file}`), {
    encoding: 'utf-8',
  });
}
