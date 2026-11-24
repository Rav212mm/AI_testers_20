import { type Locator, type Page } from '@playwright/test';

/** Pages whose last navigation was answered with the Vercel bot challenge. */
const challengedPages = new WeakSet<Page>();
/** Pages that already have the response listener attached. */
const watchedPages = new WeakSet<Page>();

/**
 * Track the Vercel bot challenge by the HTTP response (status 429 with the
 * `x-vercel-mitigated: challenge` header), not by its text: the challenge page
 * is translated to the browser language, so a text locator misses it.
 */
function watchVercelChallenge(page: Page): void {
  if (watchedPages.has(page)) {
    return;
  }
  watchedPages.add(page);
  page.on('response', (response) => {
    if (
      !response.request().isNavigationRequest() ||
      response.frame() !== page.mainFrame()
    ) {
      return;
    }
    if (response.headers()['x-vercel-mitigated'] === 'challenge') {
      challengedPages.add(page);
    } else {
      challengedPages.delete(page);
    }
  });
}

/**
 * Common behaviour of every Demobank screen.
 *
 * Two things make this app special and both are handled here:
 * - slow cold start, so every page declares a `readyLocator` proving that the
 *   screen is rendered, instead of relying on fixed delays,
 * - Vercel bot protection, which sometimes answers with a challenge page
 *   instead of the app. Reloading does not help (the same browser session keeps
 *   getting the challenge), so the test fails fast with a clear message and the
 *   Playwright retry runs it again in a fresh browser context.
 */
export abstract class BasePage {
  readonly page: Page;

  /** Element proving the screen is rendered - set by every page object. */
  protected abstract readonly readyLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    watchVercelChallenge(page);
  }

  /** Wait for `readyLocator`, failing at once when Vercel blocked the app. */
  async waitUntilReady(timeout = 30_000): Promise<void> {
    const deadline = Date.now() + timeout;

    while (Date.now() < deadline) {
      if (challengedPages.has(this.page)) {
        throw new Error(
          `Vercel bot protection blocked the demo app while opening ${this.constructor.name} ` +
            '(HTTP 429, x-vercel-mitigated: challenge). This is not a bug in the test - ' +
            'Playwright retries it in a fresh browser context.',
        );
      }
      try {
        await this.readyLocator.waitFor({ state: 'visible', timeout: 500 });
        return;
      } catch {
        // not rendered yet - check the challenge again and keep waiting
      }
    }

    throw new Error(
      `${this.constructor.name} was not rendered within ${timeout}ms ` +
        `(waiting for ${this.readyLocator}).`,
    );
  }
}

/**
 * Screens available only after a successful login. They share the header
 * with the user name and the confirmation messages / dialog.
 */
export abstract class LoggedInPage extends BasePage {
  // app header
  readonly userName: Locator;
  // confirmation area reused by payments and dashboard widgets
  readonly messages: Locator;
  readonly confirmationDialog: Locator;

  constructor(page: Page) {
    super(page);
    this.userName = page.getByTestId('user-name');
    this.messages = page.locator('#show_messages');
    this.confirmationDialog = page.locator('.ui-dialog:visible');
  }

  /** Dismiss the "Przelew wykonany!" / "Doładowanie wykonane!" dialog. */
  async closeConfirmationDialog(): Promise<void> {
    await this.confirmationDialog.getByTestId('close-button').click();
  }
}
