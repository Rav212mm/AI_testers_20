import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.pages';

/**
 * Page Object Model for the Demobank login screen.
 *
 * Locators live in one place, so a change of the `data-testid` in the app
 * requires an update here only, never inside the specs.
 */
export class LoginPage extends BasePage {
  // login form
  readonly userIdInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  // validation messages
  readonly userIdError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    super(page);
    this.userIdInput = page.getByTestId('login-input');
    this.passwordInput = page.getByTestId('password-input');
    this.loginButton = page.getByTestId('login-button');
    this.userIdError = page.getByTestId('error-login-id');
    this.passwordError = page.getByTestId('error-login-password');
    this.readyLocator = this.userIdInput;
  }

  /** Type the credentials and hit the login button. */
  async login(userId: string, userPassword: string): Promise<void> {
    await this.userIdInput.fill(userId);
    await this.passwordInput.fill(userPassword);
    await this.loginButton.click();
  }

  /** Trigger the "id too short" validation by leaving the id field. */
  async fillUserIdOnly(userId: string): Promise<void> {
    await this.userIdInput.fill(userId);
    await this.passwordInput.click();
  }

  /** Trigger the "password too short" validation by blurring the password field. */
  async fillPasswordAndBlur(userPassword: string): Promise<void> {
    await this.passwordInput.fill(userPassword);
    await this.passwordInput.blur();
  }
}

export default LoginPage;
