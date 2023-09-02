import { expect, test } from '@playwright/test';

import { removeEmphasisFormatting } from 'utils/lib/text/formatting/Emphasis';

const INITIAL_TEXT =
  '**A chain**; jewel and dainty. The one "I cherished" and wore everyday which [Ange-Desirée](https://www.instagram.com/angedesiree_x/) got for me about 4/5 years ago eventually.';
const EXPECTED_TEXT =
  'A chain; jewel and dainty. The one "I cherished" and wore everyday which Ange-Desirée got for me about 4/5 years ago eventually.';

test.describe('Text', () => {
  test('remove emphasis formatting', () => {
    const deformattedText = removeEmphasisFormatting(INITIAL_TEXT);
    expect(deformattedText).toEqual(EXPECTED_TEXT);
  });
});
