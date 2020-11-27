/* eslint-disable no-console */
import readline from 'readline';

import { updateDiary } from './diary.manual';
import { raffleSubscribers } from './subscriber.manual';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

promptInput();

function promptInput() {
  showOptions();
  rl.question('Choice: ', async function (number) {
    switch (number) {
      case '1':
        await updateDiary();
        break;
      case '2':
        await raffleSubscribers();
        break;
      default:
        break;
    }

    console.log();
    return promptInput();
  });
}

function showOptions() {
  console.log('Choose your option:');
  console.log('(1) Email Test (Update Diary)');
  console.log('(2) Subscriber Raffle');
  console.log('');
}

rl.on('close', function () {
  console.log('\nExiting.');
  process.exit(0);
});
