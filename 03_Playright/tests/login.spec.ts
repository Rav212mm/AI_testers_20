import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.pages';
import { loginData } from '../test-data/login.data';

test.describe('User login to Demobank', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should log in with correct credentials and show the user name', async () => {
    // Act
    await loginPage.login(loginData.userId, loginData.userPassword);

    // Assert
    await expect(loginPage.userName).toHaveText(loginData.expectedUserName);
  });

  test('should reject a user id shorter than 8 characters', async () => {
    // Arrange
    const tooShortUserId = 'tester';
    const expectedErrorMessage = 'identyfikator ma min. 8 znaków';

    // Act
    await loginPage.fillUserIdOnly(tooShortUserId);

    // Assert
    await expect(loginPage.userIdError).toHaveText(expectedErrorMessage);
  });

  test('should reject a password shorter than 8 characters', async () => {
    // Arrange
    const tooShortPassword = '123';
    const expectedErrorMessage = 'hasło ma min. 8 znaków';

    // Act
    await loginPage.userIdInput.fill(loginData.userId);
    await loginPage.fillPasswordAndBlur(tooShortPassword);

    // Assert
    await expect(loginPage.passwordError).toHaveText(expectedErrorMessage);
  });
});
