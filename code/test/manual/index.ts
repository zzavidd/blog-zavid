import { submitDiary, updateDiary } from './entities/diary.manual';
import { submitPost, updatePost } from './entities/post.manual';
import { raffleSubscribers } from './entities/subscriber.manual';
import 'colors';

import { rl } from '../constants';

const COLOR = 'cyan';
const COUNT = 40;
const ASTERISKS = '*'.repeat(COUNT)[COLOR];
const PADDER = '**'[COLOR];

showMenu();

/** Show the full menu on the console. */
function showMenu() {
  const options: Record<string, ManualOption> = {
    1: {
      name: 'Post Submit (Notification Test)',
      method: submitPost
    },
    2: {
      name: 'Post Update (Notification Test)',
      method: updatePost
    },
    3: {
      name: 'Diary Submit (Notification Test)',
      method: submitDiary
    },
    4: {
      name: 'Diary Update (Notification Test)',
      method: updateDiary
    },
    5: {
      name: 'Subscriber Raffle',
      method: raffleSubscribers
    }
  };

  showOptions(options);

  rl.question('Choice: ', async function (choice) {
    try {
      await options[choice].method();
    } catch (err) {
      console.error(err);
      process.exit(0);
    }

    console.info();
    showMenu();
  });
}

/** Show the menu options on the console. */
function showOptions(options: Record<string, ManualOption>) {
  console.info(ASTERISKS);
  console.info(`${PADDER} Choose your option:`);

  Object.entries(options).forEach(([key, { name }]) => {
    console.info(`${PADDER} (${key}) ${name}`);
  });

  console.info(ASTERISKS);
  console.info('');
}

type ManualOption = {
  name: string;
  method: () => Promise<void>;
};
