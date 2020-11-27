/* eslint-disable no-console */
import readline from 'readline';

import { clearAllData } from './clear';
import { ingestEpistles, ingestReveries } from './entities/post.ingest';
import { ingestSubscribers } from './entities/subscriber.ingest';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const options: Record<string, () => Promise<void>> = {
  1: ingestReveries,
  2: ingestEpistles,
  3: ingestSubscribers,
  4: clearAllData,
  5: completeWipe
};

showMenu();

function showMenu() {
  showOptions();
  rl.question('Choice: ', async function (choice) {
    try {
      await options[choice]();
    } catch (err) {
      console.error(err);
      process.exit(0);
    }

    console.log();
    showMenu();
  });
}

function showOptions() {
  console.log('Choose your option:');
  console.log('(1) Ingest Reveries');
  console.log('(2) Ingest Epistles');
  console.log('(3) Ingest Subscribers');
  console.log('(4) Clear All Data');
  console.log('(5) Full Wipe');
  console.log('');
}

async function ingestAll() {
  await Promise.all([ingestReveries(), ingestEpistles(), ingestSubscribers()]);
}

async function completeWipe() {
  await clearAllData();
  await ingestAll();
}

rl.on('close', function () {
  console.log('\nExiting.');
  process.exit(0);
});
