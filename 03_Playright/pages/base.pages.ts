import { type Locator, type Page } from '@playwright/test';

/**
 * Common behaviour of every Demobank screen.
 *
 * Two things make this app special and both are handled here:
 * - slow cold start, so every page declares a `readyLocator` proving that the
 *   screen is rendered, instead of relying on fixed delays,
 * - Vercel bot protection, which sometimes serves a challenge page instead of
 *   the app, so a screen that does not show up is reloaded a few times.
 */
export class BasePage {
  readonly page: Page;

  // app header (visible on every screen after a successful login)
  readonly userName: Locator;
  // confirmation area reused by payments and dashboard widgets
  readonly messages: Locator;
  readonly confirmationDialog: Locator;
  // Vercel bot check shown instead of the app when the traffic is too high
  readonly vercelCheckpoint: Locator;

  /** Element proving the screen is rendered - set by every page object. */
  protected readyLocator: Locator | undefined;

  constructor(page: Page) {
    this.page = page;
    this.userName = page.getByTestId('user-name');
    this.messages = page.locator('#show_messages');
    this.confirmationDialog = page.locator('.ui-dialog:visible');
    this.vercelCheckpoint = page
      .getByText('Vercel Security Checkpoint')
      .first();
  }

  /** Open the app root and wait until the screen is rendered. */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitUntilReady();
  }

  /**
   * Wait for `readyLocator`. When Vercel answers with its bot check
   * ("Failed to verify your browser") the page is reloaded until the real app
   * shows up, so a blocked cold start does not fail the whole test.
   */
  async waitUntilReady(timeout = 30_000): Promise<void> {
    if (!this.readyLocator) {
      return;
    }
    const deadline = Date.now() + timeout;
    let blockedByVercel = false;

    while (Date.now() < deadline) {
      if (await this.readyLocator.isVisible()) {
        return;
      }
      if (await this.vercelCheckpoint.isVisible()) {
        blockedByVercel = true;
        await this.page.reload({ waitUntil: 'domcontentloaded' });
      }
      await this.page.waitForTimeout(500);
    }

    if (blockedByVercel) {
      throw new Error(
        'Vercel bot check ("Failed to verify your browser") blocked the demo app. ' +
          'Run with fewer parallel workers, e.g. npx playwright test --workers=1.',
      );
    }
    throw new Error(
      `${this.constructor.name} was not rendered within ${timeout}ms ` +
        `(waiting for ${this.readyLocator}).`,
    );
  }

  /** Dismiss the "Przelew wykonany!" / "Doładowanie wykonane!" dialog. */
  async closeConfirmationDialog(): Promise<void> {
    await this.confirmationDialog.getByTestId('close-button').click();
  }
}

export default BasePage;
