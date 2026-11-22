import { test, expect } from '@playwright/test';

test.describe('User login to Demobank', () => {
  
  test.beforeEach(async ({ page }) => {
    const BASE_URL = 'https://demo-bank.vercel.app/';
    await page.goto(BASE_URL);
  });

  test('should log in with correct credentials and show the user name', async ({
    page,
  }) => {
    // Arrange
    const userId = 'Rafal123';
    const userPassword = 'haslo123';
    const expectedUserName = 'Jan Demobankowy';

    // Act
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(userPassword);
    await page.getByTestId('login-button').click();

    // Assert
    await expect(page.getByTestId('user-name')).toHaveText(expectedUserName);
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
    const userId = 'Rafal123';
    const tooShortPassword = '123';
    const expectedErrorMessage = 'hasło ma min. 8 znaków';

    // Act
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(tooShortPassword);
    await page.getByTestId('password-input').blur();

    // Assert
    await expect(page.getByTestId('error-login-password')).toHaveText(
      expectedErrorMessage,
    );
  });
});
