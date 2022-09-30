import readline from 'readline';

export const rl = readline
  .createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  .on('close', exit);

export function exit(): Promise<void> {
  console.info('\nExiting.');
  return process.exit(0);
}
