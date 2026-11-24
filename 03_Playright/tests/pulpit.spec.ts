import { test, expect } from '../fixtures/demobank.fixture';
import { phoneTopUpData, quickTransferData } from '../test-data/pulpit.data';

/*
 * Each operation is checked in one test for both of its visible results: the
 * confirmation message and the new balance. Separate tests would only repeat
 * the same login + operation, and every extra session to the demo app makes
 * the Vercel rate limit (HTTP 429) more likely.
 */
test.describe('Pulpit (dashboard) tests', () => {
  // Demobank can start slowly (cold start), so give the tests more time.
  test.describe.configure({ timeout: 60_000 });

  test('should execute a quick transfer and decrease the balance', async ({
    dashboardPage,
  }) => {
    // Arrange
    const { receiver, receiverName, amount, title } = quickTransferData;
    const expectedConfirmation = `Przelew wykonany! ${receiverName} - ${amount},00PLN - ${title}`;
    const initialBalance = await dashboardPage.getBalance();
    const expectedBalance = initialBalance - Number(amount);

    // Act
    await dashboardPage.makeQuickTransfer({ receiver, amount, title });

    // Assert
    await expect.soft(dashboardPage.messages).toHaveText(expectedConfirmation);
    await expect
      .poll(() => dashboardPage.getBalance())
      .toBeCloseTo(expectedBalance, 2);
  });

  test('should top up a phone and decrease the balance', async ({
    dashboardPage,
  }) => {
    // Arrange
    const { phoneNumber, amount } = phoneTopUpData;
    const expectedConfirmation = `Doładowanie wykonane! ${amount},00PLN na numer ${phoneNumber}`;
    const initialBalance = await dashboardPage.getBalance();
    const expectedBalance = initialBalance - Number(amount);

    // Act
    await dashboardPage.topUpPhone({ phoneNumber, amount });

    // Assert
    await expect.soft(dashboardPage.messages).toHaveText(expectedConfirmation);
    await expect
      .poll(() => dashboardPage.getBalance())
      .toBeCloseTo(expectedBalance, 2);
  });
});
