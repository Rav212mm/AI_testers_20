import { test, expect } from '../fixtures/demobank.fixture';
import { loginData } from '../test-data/login.data';

test.describe('User login to Demobank', () => {
  test('should log in with correct credentials and show the user name', async ({
    loginPage,
  }) => {
    // Act
    const dashboardPage = await loginPage.login(
      loginData.userId,
      loginData.userPassword,
    );

    // Assert
    await expect(dashboardPage.userName).toHaveText(loginData.expectedUserName);
  });

  test('should reject a user id shorter than 8 characters', async ({
    loginPage,
  }) => {
    // Arrange
    const tooShortUserId = 'tester';
    const expectedErrorMessage = 'identyfikator ma min. 8 znaków';

    // Act
    await loginPage.fillUserIdAndBlur(tooShortUserId);

    // Assert
    await expect(loginPage.userIdError).toHaveText(expectedErrorMessage);
  });

  test('should reject a password shorter than 8 characters', async ({
    loginPage,
  }) => {
    // Arrange
    const tooShortPassword = '123';
    const expectedErrorMessage = 'hasło ma min. 8 znaków';

    // Act
    await loginPage.fillUserId(loginData.userId);
    await loginPage.fillPasswordAndBlur(tooShortPassword);

    // Assert
    await expect(loginPage.passwordError).toHaveText(expectedErrorMessage);
  });
});
