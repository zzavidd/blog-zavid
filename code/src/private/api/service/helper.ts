import { debug } from '../../error';

const isProduction = process.env.NODE_ENV === 'production';
export const emailsOn = isProduction || process.argv.includes('--emails');
export const telegramOn = isProduction || process.argv.includes('--telegram');

const emailWarning = generateWarning('Emails', emailsOn);
const telegramWarning = generateWarning('Telegram notifications', telegramOn);
console.warn(emailWarning);
console.warn(telegramWarning);

export const TryWrapper = <T extends unknown>(
  consumer: () => Promise<T>
): Promise<T> => {
  let result;

  try {
    result = consumer();
  } catch (err) {
    debug(err as Error);
  }

  return result as Promise<T>;
};

/**
 * Generate the console warning message.
 * @param subject The subject of the warning.
 * @param flag The flag indicating if the CLI option is present.
 */
function generateWarning(subject: string, flag: boolean) {
  return `${subject} are turned ${flag ? 'on' : 'off'}.`[
    flag ? 'yellow' : 'white'
  ];
}
