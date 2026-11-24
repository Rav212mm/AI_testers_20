import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.pages';

export type BankTransfer = {
  receiver: string;
  account: string;
  amount: string;
};

/** Page Object Model for the Demobank payments screen (płatności). */
export class PaymentsPage extends BasePage {
  readonly transferReceiver: Locator;
  readonly transferAccount: Locator;
  readonly transferAmount: Locator;
  readonly transferButton: Locator;

  constructor(page: Page) {
    super(page);
    this.transferReceiver = page.getByTestId('transfer_receiver');
    this.transferAccount = page.getByTestId('form_account_to');
    this.transferAmount = page.getByTestId('form_amount');
    this.transferButton = page.getByRole('button', {
      name: 'wykonaj przelew',
    });
    this.readyLocator = this.transferReceiver;
  }

  /** Fill and execute the bank transfer, then close the dialog. */
  async makeTransfer({ receiver, account, amount }: BankTransfer) {
    await this.transferReceiver.fill(receiver);
    await this.transferAccount.fill(account);
    await this.transferAmount.fill(amount);
    await this.transferButton.click();
    await this.closeConfirmationDialog();
  }
}

export default PaymentsPage;
