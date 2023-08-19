import { faker } from '@faker-js/faker/locale/en_GB';
import { expect, test } from '@playwright/test';

import SubscriberAPI from '../../src/server/api/subscribers';
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
  test.describe.configure({ mode: 'parallel' });

  test.describe('via page form', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/subscribe');
      await page.getByTestId('zb.accept').click();
    });

    test('has correct page title', async ({ page }) => {
      await expect(page).toHaveTitle(`Subscribe | ${Settings.SITE_TITLE}`);
    });

    test('with valid email and names', async ({ page }) => {
      const text = page.getByTestId('zb.completionText');
      await expect(text).toHaveCount(0);

      await page.getByTestId('zb.email').fill(subscriber.email);
      await page.getByTestId('zb.firstname').fill(subscriber.firstname);
      await page.getByTestId('zb.lastname').fill(subscriber.lastname);
      await page.getByTestId('zb.submit').click();

      await expect(text).toHaveText(/Thank you/);
      await SubscriberAPI.delete({ where: { email: subscriber.email } });
    });

    [
      { name: 'with no email', value: '' },
      { name: 'with invalid email', value: 'thisIsNotAnEmailAddress' },
    ].forEach(({ name, value }) => {
      test(name, async ({ page }) => {
        await page.getByTestId('zb.email').fill(value);
        await page.getByTestId('zb.submit').click();

        const alert = page.getByTestId('zb.alert.error');
        await expect(alert).toBeVisible();

        const text = page.getByTestId('zb.completionText');
        await expect(text).toHaveCount(0);
      });
    });
  });

  test.describe('via Quick Subscribe', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByTestId('zb.accept').click();
    });

    test('with correct email', async ({ page }) => {
      await page.getByTestId('zb.quicksubscribe.email').fill(subscriber.email);
      await page.getByTestId('zb.quicksubscribe.button').click();

      const alert = page.getByTestId('zb.alert.success');
      await expect(alert).toBeVisible();
      await SubscriberAPI.delete({ where: { email: subscriber.email } });
    });

    [
      { name: 'with no email', value: '' },
      { name: 'with invalid email', value: 'thisIsNotAnEmailAddress' },
    ].forEach(({ name, value }) => {
      test(name, async ({ page }) => {
        await page.getByTestId('zb.quicksubscribe.email').fill(value);
        await page.getByTestId('zb.quicksubscribe.button').click();

        const alert = page.getByTestId('zb.alert.error');
        await expect(alert).toBeVisible();
      });
    });
  });
});
