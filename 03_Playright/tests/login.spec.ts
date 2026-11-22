import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';

test.describe('User login to Demobank', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should log in with correct credentials and show the user name', async ({
    page,
  }) => {
    // Act
    await page.getByTestId('login-input').fill(loginData.userId);
    await page.getByTestId('password-input').fill(loginData.userPassword);
    await page.getByTestId('login-button').click();

    // Assert
    await expect(page.getByTestId('user-name')).toHaveText(
      loginData.expectedUserName,
    );
  });

  test('should reject a user id shorter than 8 characters', async ({
    page,
  }) => {
    // Arrange
    const tooShortUserId = 'tester';
    const expectedErrorMessage = 'identyfikator ma min. 8 znaków';

    // Act
    await page.getByTestId('login-input').fill(tooShortUserId);
    await page.getByTestId('password-input').click();

    // Assert
    await expect(page.getByTestId('error-login-id')).toHaveText(
      expectedErrorMessage,
    );
  });

  test('should reject a password shorter than 8 characters', async ({
    page,
  }) => {
    // Arrange
    const tooShortPassword = '123';
    const expectedErrorMessage = 'hasło ma min. 8 znaków';

    // Act
    await page.getByTestId('login-input').fill(loginData.userId);
    await page.getByTestId('password-input').fill(tooShortPassword);
    await page.getByTestId('password-input').blur();

    // Assert
    await expect(page.getByTestId('error-login-password')).toHaveText(
      expectedErrorMessage,
    );
  });
});
