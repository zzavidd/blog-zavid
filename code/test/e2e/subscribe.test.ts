import { faker } from '@faker-js/faker/locale/en_GB';
import { expect, test } from '@playwright/test';

import Settings from '../../src/utils/settings';

const name = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
};
const subscriber = {
  email: faker.internet.email(name),
  firstname: name.firstName,
  lastname: name.lastName,
};

test.describe('Subscribe', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/subscribe');
    await page.getByTestId('zb.accept').click();
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(`Subscribe | ${Settings.SITE_TITLE}`);
  });

  test('with correct input', async ({ page }) => {
    const text = page.getByTestId('zb.completionText');
    await expect(text).toHaveCount(0);

    await page.getByTestId('zb.email').fill(subscriber.email);
    await page.getByTestId('zb.firstname').fill(subscriber.firstname);
    await page.getByTestId('zb.lastname').fill(subscriber.lastname);
    await page.getByTestId('zb.submit').click();

    await expect(text).toHaveText(/Thank you/);
  });

  [
    { name: 'with no email input', value: '' },
    { name: 'with invalid email input', value: 'thisIsNotAnEmailAddress' },
  ].forEach(({ name, value }) => {
    test(name, async ({ page }) => {
      await page.getByTestId('zb.email').fill(value);
      await page.getByTestId('zb.submit').click();

      const alert = page.getByTestId('zb.alert');
      const text = page.getByTestId('zb.completionText');
      await expect(alert).toBeVisible();
      await expect(text).toHaveCount(0);
    });
  });
});
