import { test, expect } from '@playwright/test';

const BASE_URL = 'https://demo-bank.vercel.app/';

test.describe('Pulpit (dashboard) tests', () => {
  test.describe.configure({ retries: 3 });

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByTestId('login-input').fill('testerLO');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();
  });

  test('should execute a quick payment with correct data', async ({ page }) => {
    // Arrange
    const receiverOption = '2';
    const expectedReceiverName = 'Chuck Demobankowy';
    const transferAmount = '150';
    const expectedTransferAmount = '150,00PLN';
    const transferTitle = 'pizza';
    const expectedConfirmation = `Przelew wykonany! ${expectedReceiverName} - ${expectedTransferAmount} - ${transferTitle}`;

    // Act
    await page.waitForLoadState('domcontentloaded');
    await page
      .locator('#widget_1_transfer_receiver')
      .waitFor({ state: 'visible' });

    await page
      .locator('#widget_1_transfer_receiver')
      .selectOption(receiverOption);
    await page.locator('#widget_1_transfer_amount').fill(transferAmount);
    await page.locator('#widget_1_transfer_title').fill(transferTitle);

    await page.getByRole('button', { name: 'wykonaj' }).click();
    await page.getByTestId('close-button').click();

    // Assert
    await expect(page.locator('#show_messages')).toHaveText(
      expectedConfirmation,
    );
  });

  test('should top up a phone number with correct data', async ({ page }) => {
    // Arrange
    const phoneNumber = '500 xxx xxx';
    const topUpAmount = '50';
    const expectedTopUpAmount = '50,00PLN';
    const expectedConfirmation = `Doładowanie wykonane! ${expectedTopUpAmount} na numer ${phoneNumber}`;

    // Act
    await page.locator('#widget_1_topup_receiver').selectOption(phoneNumber);
    await page.locator('#widget_1_topup_amount').fill(topUpAmount);
    await page.locator('#uniform-widget_1_topup_agreement span').click();
    await page.getByRole('button', { name: 'doładuj telefon' }).click();
    await page.getByTestId('close-button').click();

    // Assert
    await expect(page.locator('#show_messages')).toHaveText(
      expectedConfirmation,
    );
  });
});
