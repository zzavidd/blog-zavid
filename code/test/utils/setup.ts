import 'dotenv/config';

import logger from 'utils/logger';

export default function globalSetup(): void {
  const url = process.env.DATABASE_URL;
  if (!url || !url.endsWith('test')) {
    logger.warn(
      'Failsafe triggered: erroneously using non-development database',
    );
    process.exit(0);
  }
}
