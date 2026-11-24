import { test, expect } from '../fixtures/demobank.fixture';
import { type PaymentsPage } from '../pages/payments.page';

test.describe('Payment tests', () => {
  // Demobank can start slowly (cold start), so give the tests more time.
  test.describe.configure({ timeout: 60_000 });

  let paymentsPage: PaymentsPage;

  test.beforeEach(async ({ dashboardPage }) => {
    paymentsPage = await dashboardPage.openPayments();
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
