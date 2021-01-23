import { zNumber } from 'zavid-modules';

import { getSubscribers } from '../../helper/subscriber.helper';

export async function raffleSubscribers() {
  const subscribers = await getSubscribers();
  const candidates = subscribers.map(({ firstname, lastname }) => {
    return firstname + (lastname ? ' ' + lastname : '');
  });
  draw(candidates);
}

function draw(candidates: string[]): void {
  const originalSet = candidates;

  while (candidates.length > 1) {
    console.info(candidates);
    candidates = candidates.filter(() => zNumber.generateRandom(1, 50) >= 3);
  }

  if (candidates.length !== 1) {
    draw(originalSet);
    return;
  }

  console.info('');
  console.info('*******************');
  console.info('And the winner is:');
  console.info('');
  console.info(candidates[0]);
  console.info('*******************');
  console.info('');
}
