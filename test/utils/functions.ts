import { type BrowserContext } from '@playwright/test';

import Settings from 'utils/settings';

export async function setConsentCookies(
  context: BrowserContext,
  baseURL?: string,
): Promise<void> {
  await context.addCookies([
    {
      name: Settings.COOKIES.CONSENT,
      value: 'false',
      url: baseURL,
      expires: -1,
      secure: false,
    },
    {
      name: Settings.COOKIES.TIP,
      value: 'true',
      url: baseURL,
      expires: -1,
      secure: false,
    },
  ]);
}
