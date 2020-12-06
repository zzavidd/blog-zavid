/* eslint-disable no-console */
import { clearAllData } from './clear';
import { rl } from './constants';
import { ingestDiary } from './entities/diary.ingest';
import { ingestEpistles, ingestReveries } from './entities/post.ingest';
import { ingestSubscribers } from './entities/subscriber.ingest';

const options: Record<string, () => Promise<void>> = {
  1: ingestReveries,
  2: ingestEpistles,
  3: ingestDiary,
  4: ingestSubscribers,
  5: ingestAll,
  6: clearAllData,
  7: clearAndIngestAll
};

async function ingestAll() {
  await Promise.all([
    ingestReveries(),
    ingestEpistles(),
    ingestDiary(),
    ingestSubscribers()
  ]);
}

async function clearAndIngestAll() {
  await clearAllData();
  await ingestAll();
}

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
  console.log('**************************');
  console.log('Choose your option:');
  console.log('');
  console.log('(1) Ingest Reveries');
  console.log('(2) Ingest Epistles');
  console.log('(3) Ingest Diary Entries');
  console.log('(4) Ingest Subscribers');
  console.log('(5) Ingest All');
  console.log('(6) Clear All Data');
  console.log('(7) Clear & Ingest All');
  console.log('**************************');
  console.log('');
}
