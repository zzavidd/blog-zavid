import TelegramBot from 'node-telegram-bot-api';
import { zDate } from 'zavid-modules';

import { DiaryDAO, PostDAO, PostStatic } from '../../../../classes';
import { domain } from '../../../settings';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!);
const dev = process.env.NODE_ENV !== 'production';

const TEST_LINK = 'https://www.zavidegbue.com';

/**
 * Notify Telegram channel of new post.
 * @param post The post to notify about.
 */
export function notifyNewPost(post: PostDAO): Promise<void> {
  const { title, type, typeId } = post;
  const path = PostStatic.getDirectory(type!);
  const link = dev ? TEST_LINK : `${domain}/${path}/${post.slug}`;
  const content = `*New ${type} (#${typeId}) "${title}"*\n[Check it out](${link})!`;
  return notify(content);
}

/**
 * Notify Telegram channel of new diary entry.
 * @param entry The diary entry to notify about.
 */
export function notifyNewDiaryEntry(entry: DiaryDAO): Promise<void> {
  const { title, entryNumber } = entry;
  const link = dev ? TEST_LINK : `${domain}/diary/${entryNumber}`;
  const content = `*New Diary Entry #${entryNumber}: ${title}*\n[Have a read](${link}).`;
  return notify(content);
}

/**
 * Send a message to the Telegram channel.
 * @param content The content of the message to send.
 */
async function notify(content: string): Promise<void> {
  try {
    const value = await bot.sendMessage(
      process.env.TELEGRAM_BOT_CHANNEL!,
      content,
      {
        parse_mode: 'Markdown'
      }
    );
    const { title, type } = value.chat;
    const timestamp = getTimestamp();
    console.info(
      `(${timestamp}) Sent Telegram message to "${title} ${type}".`.green
    );
  } catch (error) {
    const description: string = error.response.body.description;
    const timestamp = getTimestamp();
    console.error(
      `(${timestamp}) Attempt to send Telegram message failed with response: "${description}."`
        .red
    );
  }
}

/** Returns the current timestamp. */
function getTimestamp() {
  return zDate.formatISOTime(new Date());
}
