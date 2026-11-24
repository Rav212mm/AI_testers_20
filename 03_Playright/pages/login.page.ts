import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { DashboardPage } from './dashboard.page';

/**
 * Page Object Model for the Demobank login screen.
 *
 * Locators live in one place, so a change of the `data-testid` in the app
 * requires an update here only, never inside the specs.
 */
export class LoginPage extends BasePage {
  // the login screen is the entry point of the app
  static readonly url = '/';

  // login form
  readonly userIdInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  // validation messages
  readonly userIdError: Locator;
  readonly passwordError: Locator;

  protected readonly readyLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.userIdInput = page.getByTestId('login-input');
    this.passwordInput = page.getByTestId('password-input');
    this.loginButton = page.getByTestId('login-button');
    this.userIdError = page.getByTestId('error-login-id');
    this.passwordError = page.getByTestId('error-login-password');
    this.readyLocator = this.userIdInput;
  }

  /** Open the login screen and wait until it is rendered. */
  async goto(): Promise<void> {
    await this.page.goto(LoginPage.url, { waitUntil: 'domcontentloaded' });
    await this.waitUntilReady();
  }

  /**
   * Log in and return the dashboard once it is rendered, so a failed login
   * is reported here and not later by some unrelated locator.
   */
  async login(userId: string, userPassword: string): Promise<DashboardPage> {
    await this.userIdInput.fill(userId);
    await this.passwordInput.fill(userPassword);
    await this.loginButton.click();

    const dashboardPage = new DashboardPage(this.page);
    await dashboardPage.waitUntilReady();
    return dashboardPage;
  }

  /** Type the user id only. */
  async fillUserId(userId: string): Promise<void> {
    await this.userIdInput.fill(userId);
  }

  /** Trigger the "id too short" validation by leaving the id field. */
  async fillUserIdAndBlur(userId: string): Promise<void> {
    await this.fillUserId(userId);
    await this.userIdInput.blur();
  }

  /** Trigger the "password too short" validation by leaving the password field. */
  async fillPasswordAndBlur(userPassword: string): Promise<void> {
    await this.passwordInput.fill(userPassword);
    await this.passwordInput.blur();
  }
}
