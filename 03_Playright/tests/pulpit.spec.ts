import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.pages';
import { DashboardPage } from '../pages/dashboard.pages';
import { loginData } from '../test-data/login.data';

test.describe('Pulpit (dashboard) tests', () => {
  test.describe.configure({ retries: 3, timeout: 60_000 });

  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Demobank can start slowly (cold start), so wait for elements instead of guessing.
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginData.userId, loginData.userPassword);

    // Leave the hook only when the dashboard is really rendered.
    dashboard = new DashboardPage(page);
    await dashboard.waitUntilReady();
  });

  test('should execute a quick payment with correct data', async () => {
    // Arrange
    const receiverOption = '2';
    const expectedReceiverName = 'Chuck Demobankowy';
    const transferAmount = '150';
    const expectedTransferAmount = '150,00PLN';
    const transferTitle = 'pizza';
    const expectedConfirmation = `Przelew wykonany! ${expectedReceiverName} - ${expectedTransferAmount} - ${transferTitle}`;

    // Act
    await dashboard.makeQuickTransfer({
      receiver: receiverOption,
      amount: transferAmount,
      title: transferTitle,
    });

    // Assert
    await expect(dashboard.messages).toHaveText(expectedConfirmation);
  });

  test('should top up a phone number with correct data', async () => {
    // Arrange
    const phoneNumber = '500 xxx xxx';
    const topUpAmount = '50';
    const expectedTopUpAmount = '50,00PLN';
    const expectedConfirmation = `Doładowanie wykonane! ${expectedTopUpAmount} na numer ${phoneNumber}`;

    // Act
    await dashboard.topUpPhone({ phoneNumber, amount: topUpAmount });

    // Assert
    await expect(dashboard.messages).toHaveText(expectedConfirmation);
  });

  test('should decrease the account balance after a phone top up', async () => {
    // Arrange
    const phoneNumber = '500 xxx xxx';
    const topUpAmount = '50';
    const initialBalance = await dashboard.getBalance();
    const expectedBalance = String(initialBalance - Number(topUpAmount));

    // Act
    await dashboard.topUpPhone({ phoneNumber, amount: topUpAmount });

    // Assert
    await expect(dashboard.balance).toHaveText(expectedBalance);
  });
});
