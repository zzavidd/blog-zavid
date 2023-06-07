import { faker } from '@faker-js/faker/locale/en_GB';

import SubscriberAPI from '../../src/server/api/subscribers';
import Settings from '../../src/utils/settings';
import { expect, test } from '../fixtures';

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
  test.describe('via page form', () => {
    test.beforeEach(async ({ zPage }) => {
      await zPage.goto('/subscribe');
    });

    test('has correct page title', async ({ zPage }) => {
      await expect(zPage).toHaveTitle(`Subscribe | ${Settings.SITE_TITLE}`);
    });

    test('with valid email and names', async ({ zPage }) => {
      const text = zPage.getByTestId('zb.completionText');
      await expect(text).toHaveCount(0);

      await zPage.getByTestId('zb.email').fill(subscriber.email);
      await zPage.getByTestId('zb.firstname').fill(subscriber.firstname);
      await zPage.getByTestId('zb.lastname').fill(subscriber.lastname);
      await zPage.getByTestId('zb.submit').click();

      await expect(text).toHaveText(/Thank you/);
      await SubscriberAPI.delete({ where: { email: subscriber.email } });
    });

    [
      { name: 'with no email', value: '' },
      { name: 'with invalid email', value: 'thisIsNotAnEmailAddress' },
    ].forEach(({ name, value }) => {
      test(name, async ({ zPage }) => {
        await zPage.getByTestId('zb.email').fill(value);
        await zPage.getByTestId('zb.submit').click();

        const alert = zPage.getByTestId('zb.alert.error');
        await expect(alert).toBeVisible();

        const text = zPage.getByTestId('zb.completionText');
        await expect(text).toHaveCount(0);
      });
    });
  });

  test.describe('via Quick Subscribe', () => {
    test('with correct email', async ({ zPage }) => {
      await zPage.getByTestId('zb.quicksubscribe.email').fill(subscriber.email);
      await zPage.getByTestId('zb.quicksubscribe.button').click();

      const alert = zPage.getByTestId('zb.alert.success');
      await expect(alert).toBeVisible();
      await SubscriberAPI.delete({ where: { email: subscriber.email } });
    });

    [
      { name: 'with no email', value: '' },
      { name: 'with invalid email', value: 'thisIsNotAnEmailAddress' },
    ].forEach(({ name, value }) => {
      test(name, async ({ zPage }) => {
        await zPage.getByTestId('zb.quicksubscribe.email').fill(value);
        await zPage.getByTestId('zb.quicksubscribe.button').click();

        const alert = zPage.getByTestId('zb.alert.error');
        await expect(alert).toBeVisible();
      });
    });
  });
});
