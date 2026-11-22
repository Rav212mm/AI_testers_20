import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';

test.describe('Payment tests', () => {
  // Demobank can start slowly (cold start), so wait for elements instead of guessing.
  test.describe.configure({ retries: 3, timeout: 60_000 });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('login-input')).toBeVisible({
      timeout: 30_000,
    });

    await page.getByTestId('login-input').fill(loginData.userId);
    await page.getByTestId('password-input').fill(loginData.userPassword);
    await page.getByTestId('login-button').click();

    // Fail with a clear error when the login itself did not work.
    const paymentsLink = page.getByRole('link', { name: 'płatności' });
    await expect(paymentsLink).toBeVisible({ timeout: 30_000 });
    await paymentsLink.click();
    await expect(page.getByTestId('transfer_receiver')).toBeVisible({
      timeout: 30_000,
    });
  });

  test('should execute a bank transfer with correct data', async ({ page }) => {
    // Arrange
    const transferReceiver = 'Jan Nowak';
    const transferAccount = '12 3456 7890 1234 5678 9012 3456';
    const transferAmount = '222';
    const expectedMessage = `Przelew wykonany! ${transferAmount},00PLN dla ${transferReceiver}`;

    // Act
    await page.getByTestId('transfer_receiver').fill(transferReceiver);
    await page.getByTestId('form_account_to').fill(transferAccount);
    await page.getByTestId('form_amount').fill(transferAmount);
    await page.getByRole('button', { name: 'wykonaj przelew' }).click();
    await page
      .locator('.ui-dialog:visible')
      .getByTestId('close-button')
      .click();

    // Assert
    await expect(page.locator('#show_messages')).toHaveText(expectedMessage);
  });
});
