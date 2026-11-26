import { test, expect } from '../fixtures/demobank.fixture';
import { type PaymentsPage } from '../pages/payments.page';

// Tags: one per dimension - module (@payments), priority, scenario type.
// See "Test tags" in README.md for the whole taxonomy.
test.describe('Payment tests', { tag: '@payments' }, () => {
  // Demobank can start slowly (cold start), so give the tests more time.
  test.describe.configure({ timeout: 60_000 });

  let paymentsPage: PaymentsPage;

  test.beforeEach(async ({ dashboardPage }) => {
    paymentsPage = await dashboardPage.openPayments();
  });

  test(
    'should execute a bank transfer with correct data',
    { tag: ['@smoke', '@positive', '@slow'] },
    async () => {
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
    },
  );
});
