import { updateDiary } from './diary.manual';
import { raffleSubscribers } from './subscriber.manual';

import { rl } from '..';

showMenu();

/** Show the full menu on the console. */
function showMenu() {
  const options: Record<string, ManualOption> = {
    1: {
      name: 'Email Test (Update Diary)',
      method: updateDiary
    },
    2: {
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
  console.info('**************************');
  console.info('Choose your option:');

  Object.entries(options).forEach(([key, { name }]) => {
    console.info(`(${key}) ${name}`);
  });

  console.info('**************************');
  console.info('');
}

type ManualOption = {
  name: string;
  method: () => Promise<void>;
};
