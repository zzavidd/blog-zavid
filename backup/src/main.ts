import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import 'dotenv/config';
import fs from 'fs';
import mysqldump from 'mysqldump';
import logger from './logger';

const DATE = getCurrentDate();
const ENV = ensureEnvironmentVariables(
  'APP_KEY_ID',
  'APP_KEY_VALUE',
  'BUCKET_ENDPOINT',
  'BUCKET_REGION',
  'BUCKET_NAME',
  'MYSQL_USER',
  'MYSQL_PASSWORD',
  'MYSQL_HOST',
  'MYSQL_DB',
);
const FILE = `${DATE}_dump.sql`;

const s3Client = new S3Client({
  credentials: {
    accessKeyId: ENV.APP_KEY_ID,
    secretAccessKey: ENV.APP_KEY_VALUE,
  },
  endpoint: ENV.BUCKET_ENDPOINT,
  region: ENV.BUCKET_REGION,
});

logger.log('Performing a dump...');
await mysqldump({
  connection: {
    host: ENV.MYSQL_HOST,
    user: ENV.MYSQL_USER,
    password: ENV.MYSQL_PASSWORD,
    database: ENV.MYSQL_DB,
  },
  dumpToFile: FILE,
});

logger.log(`Uploading '${FILE}'...`);
const putCommand = new PutObjectCommand({
  Body: fs.readFileSync(FILE),
  Bucket: ENV.BUCKET_NAME,
  Key: FILE,
});
await s3Client.send(putCommand);

logger.log('Cleaning up...');
fs.rmSync(FILE);

/**
 * Ensures that the required environment variables exist.
 * @param variables The list of environment variable names.
 * @returns A record of variables to their values.
 */
function ensureEnvironmentVariables<T extends string>(
  ...variables: readonly T[]
): Record<T, string> {
  return variables.reduce(
    (acc, name) => {
      const value = process.env[name];
      if (!value) {
        throw new Error(`Environment variable '${name}' not set.`);
      }
      acc[name] = value;
      return acc;
    },
    {} as Record<T, string>,
  );
}

/**
 * Retrieves the current date in 'YYYYMMDD' format.
 * @returns The date string.
 */
function getCurrentDate(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return year + month + day;
}
