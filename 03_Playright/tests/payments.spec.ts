import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.pages';
import { DashboardPage } from '../pages/dashboard.pages';
import { PaymentsPage } from '../pages/payments.pages';
import { loginData } from '../test-data/login.data';

test.describe('Payment tests', () => {
  // Demobank can start slowly (cold start), so wait for elements instead of guessing.
  test.describe.configure({ retries: 3, timeout: 60_000 });

  let paymentsPage: PaymentsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginData.userId, loginData.userPassword);

    // Fail with a clear error when the login itself did not work.
    const dashboard = new DashboardPage(page);
    await dashboard.waitUntilReady();
    await dashboard.openPayments();

    paymentsPage = new PaymentsPage(page);
    await paymentsPage.waitUntilReady();
  });

  test('should execute a bank transfer with correct data', async () => {
    // Arrange
    const transferReceiver = 'Jan Nowak';
    const transferAccount = '12 3456 7890 1234 5678 9012 3456';
    const transferAmount = '222';
    const expectedMessage = `Przelew wykonany! ${transferAmount},00PLN dla ${transferReceiver}`;

    // Act
    await paymentsPage.makeTransfer({
      receiver: transferReceiver,
      account: transferAccount,
      amount: transferAmount,
    });

    // Assert
    await expect(paymentsPage.messages).toHaveText(expectedMessage);
  });
});
