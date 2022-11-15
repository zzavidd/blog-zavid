import TelegramBot from 'node-telegram-bot-api';

import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import ZDate from 'lib/date';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!);

namespace Telegram {
  /**
   * Notify admin of new wishlist claim on admin.
   * @param wishlistItem The wishlist item claimed.
   * @param email The claimant email.
   * @param isAnonymous True if claimant is anonymous.
   */
  export function notifyNewWishlistClaim(
    wishlistItem: WishlistDAO,
    email: string,
    isAnonymous: boolean,
  ): Promise<void> {
    const claimant = isAnonymous ? 'Anonymous' : email;
    const content = `${claimant} has claimed *${wishlistItem.name}* on your wishlist.`;
    return notify(content);
  }
}

export default Telegram;

/**
 * Send a message to admin on Telegram.
 * @param content The content of the message to send.
 */
async function notify(content: string): Promise<void> {
  try {
    await bot.sendMessage(process.env.TELEGRAM_ADMIN_CHAT_ID!, content, {
      parse_mode: 'Markdown',
    });
  } catch (error: any) {
    const description: string = error.response.body.description;
    const timestamp = getTimestamp();
    console.error(
      `(${timestamp}) Attempt to send Telegram message failed with response: "${description}."`,
    );
  }
}

function getTimestamp() {
  return ZDate.formatISO(new Date());
}
