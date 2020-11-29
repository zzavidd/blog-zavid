import readline from 'readline';

export const COUNT = {
  REVERIE: 10,
  EPISTLE: 20,
  SUBSCRIBERS: 50
};

export const rl = readline
  .createInterface({
    input: process.stdin,
    output: process.stdout
  })
  .on('close', function () {
    console.info('\nExiting.');
    process.exit(0);
  });