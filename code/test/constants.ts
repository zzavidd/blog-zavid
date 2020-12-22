import readline from 'readline';

export const rl = readline
  .createInterface({
    input: process.stdin,
    output: process.stdout
  })
  .on('close', function () {
    console.info('\nExiting.');
    process.exit(0);
  });