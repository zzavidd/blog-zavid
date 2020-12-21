import { debug } from '../../error';

export const emailsOn =
  process.env.NODE_ENV === 'production' || process.argv.includes('--emails');
console.warn(`Emails are turned ${emailsOn ? 'on' : 'off'}.`[emailsOn ? 'yellow' : 'white']);

export const TryWrapper = <T extends unknown>(
  consumer: () => Promise<T>
): Promise<T> => {
  let result;

  try {
    result = consumer();
  } catch (err) {
    debug(err);
  }

  return result as Promise<T>;
};