import { test, expect } from '../fixtures/demobank.fixture';

test.describe('Pulpit (dashboard) tests', () => {
  // Demobank can start slowly (cold start), so give the tests more time.
  test.describe.configure({ timeout: 60_000 });

  test('should execute a quick payment with correct data', async ({
    dashboardPage,
  }) => {
    // Arrange
    const receiverOption = '2';
    const expectedReceiverName = 'Chuck Demobankowy';
    const transferAmount = '150';
    const expectedTransferAmount = '150,00PLN';
    const transferTitle = 'pizza';
    const expectedConfirmation = `Przelew wykonany! ${expectedReceiverName} - ${expectedTransferAmount} - ${transferTitle}`;

    // Act
    await dashboardPage.makeQuickTransfer({
      receiver: receiverOption,
      amount: transferAmount,
      title: transferTitle,
    });

    // Assert
    await expect(dashboardPage.messages).toHaveText(expectedConfirmation);
  });

  test('should top up a phone number with correct data', async ({
    dashboardPage,
  }) => {
    // Arrange
    const phoneNumber = '500 xxx xxx';
    const topUpAmount = '50';
    const expectedTopUpAmount = '50,00PLN';
    const expectedConfirmation = `Doładowanie wykonane! ${expectedTopUpAmount} na numer ${phoneNumber}`;

    // Act
    await dashboardPage.topUpPhone({ phoneNumber, amount: topUpAmount });

    // Assert
    await expect(dashboardPage.messages).toHaveText(expectedConfirmation);
  });

  test('should decrease the account balance after a phone top up', async ({
    dashboardPage,
  }) => {
    // Arrange
    const phoneNumber = '500 xxx xxx';
    const topUpAmount = '50';
    const initialBalance = await dashboardPage.getBalance();
    const expectedBalance = String(initialBalance - Number(topUpAmount));

    // Act
    await dashboardPage.topUpPhone({ phoneNumber, amount: topUpAmount });

    // Assert
    await expect
      .poll(() => dashboardPage.getBalance())
      .toBe(Number(expectedBalance));
  });
});
