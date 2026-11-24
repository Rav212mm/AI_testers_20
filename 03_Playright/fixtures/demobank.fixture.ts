import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { loginData } from '../test-data/login.data';

type DemobankFixtures = {
  /** Login screen, already opened and rendered. */
  loginPage: LoginPage;
  /** Dashboard of a logged in user, already rendered. */
  dashboardPage: DashboardPage;
};

/**
 * Playwright `test` extended with ready-to-use page objects, so the specs
 * do not repeat the open + log in sequence in their hooks.
 */
/**
 * Pause before a retry. Vercel answers with HTTP 429 (too many requests) when
 * the demo app is hit too often, so an immediate retry is usually blocked too.
 */
const RETRY_BACKOFF_MS = 15_000;

export const test = base.extend<DemobankFixtures>({
  loginPage: async ({ page }, use, testInfo) => {
    if (testInfo.retry > 0) {
      const backoff = RETRY_BACKOFF_MS * testInfo.retry;
      testInfo.setTimeout(testInfo.timeout + backoff);
      await page.waitForTimeout(backoff);
    }

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  dashboardPage: async ({ loginPage }, use) => {
    const dashboardPage = await loginPage.login(
      loginData.userId,
      loginData.userPassword,
    );
    await use(dashboardPage);
  },
});

export { expect } from '@playwright/test';
