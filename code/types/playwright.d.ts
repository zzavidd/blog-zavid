import '@playwright/test';

declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T> {
      toBeTruthy(): a is NonNullable<R>;
    }
  }
}
