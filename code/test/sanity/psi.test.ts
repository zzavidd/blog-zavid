import {
  pagespeedonline,
  type pagespeedonline_v5,
} from '@googleapis/pagespeedonline';
import { expect, test } from '@playwright/test';

test.describe('PageSpeed Insights', () => {
  let data: pagespeedonline_v5.Schema$PagespeedApiPagespeedResponseV5;

  test.beforeAll(async () => {
    const res = await pagespeedonline('v5').pagespeedapi.runpagespeed({
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

    data = res.data;
  });

  test('home', async () => {
    const categories = Object.entries(data.lighthouseResult?.categories || {});
    for await (const [title, { score }] of categories) {
      const metric = title.toUpperCase();
      await test.step(title, () => {
        const message = `Expected ${metric} score to be greater than 90; was '${Math.floor(
          score * 100,
        )}'.`;
        expect.soft(score, message).toBeGreaterThan(0.9);
      });
    }
  });
});
