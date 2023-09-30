import type {
  Reporter,
  TestCase,
  TestResult,
  TestStep,
} from '@playwright/test/reporter';

import logger from 'utils/logger';

export default class ContentReporter implements Reporter {
  public onStepBegin(_: TestCase, __: TestResult, step: TestStep): void {
    if (step.category !== 'test.step') return;
    logger.info(step.title);
  }

  public onStepEnd(_: TestCase, __: TestResult, step: TestStep): void {
    if (step.error && step.error.message) {
      const [message, url] = step.error.message.split(/\n/);
      logger.error([message, url].join('\n'));
    }
  }

  public onEnd(): void {
    logger.info('Finished.');
  }
}
