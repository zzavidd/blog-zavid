import { pagespeedonline } from '@googleapis/pagespeedonline';
import { expect, test } from '@playwright/test';

test.describe('PageSpeed Insights', () => {
  test('home', async () => {
    const { data } = await pagespeedonline('v5').pagespeedapi.runpagespeed({
      url: 'https://zavidegbue.com',
      category: [
        'ACCESSIBILITY',
        'BEST_PRACTICES',
        'PERFORMANCE',
        'PWA',
        'SEO',
      ],
      strategy: 'MOBILE',
      key: process.env.GOOGLE_PAGEINSIGHTS_API_KEY,
    });

    Object.entries(data.lighthouseResult?.categories || {}).forEach(
      async ([title, { score }]) => {
        await test.step(title, () => {
          expect(
            score,
            `Expected ${title.toUpperCase()} score to be greater than 90; was '${Math.floor(
              score * 100,
            )}'.`,
          ).toBeGreaterThan(0.9);
        });
      },
    );
  });
});
