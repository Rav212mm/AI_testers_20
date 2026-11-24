import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.pages';

export type QuickTransfer = {
  /** Value of the `<option>` in the receiver select, e.g. `'2'`. */
  receiver: string;
  amount: string;
  title: string;
};

export type PhoneTopUp = {
  /** Value of the `<option>` in the phone select, e.g. `'500 xxx xxx'`. */
  phoneNumber: string;
  amount: string;
};

/** Page Object Model for the Demobank dashboard (pulpit). */
export class DashboardPage extends BasePage {
  // header / account state
  readonly balance: Locator;
  readonly paymentsLink: Locator;

  // quick transfer widget
  readonly transferReceiver: Locator;
  readonly transferAmount: Locator;
  readonly transferTitle: Locator;
  readonly transferButton: Locator;

  // phone top up widget
  readonly topUpReceiver: Locator;
  readonly topUpAmount: Locator;
  readonly topUpAgreement: Locator;
  readonly topUpButton: Locator;

  constructor(page: Page) {
    super(page);
    this.balance = page.locator('#money_value');
    this.paymentsLink = page.getByRole('link', { name: 'płatności' });

    this.transferReceiver = page.locator('#widget_1_transfer_receiver');
    this.transferAmount = page.locator('#widget_1_transfer_amount');
    this.transferTitle = page.locator('#widget_1_transfer_title');
    this.transferButton = page.getByRole('button', { name: 'wykonaj' });

    this.topUpReceiver = page.locator('#widget_1_topup_receiver');
    this.topUpAmount = page.locator('#widget_1_topup_amount');
    this.topUpAgreement = page.locator(
      '#uniform-widget_1_topup_agreement span',
    );
    this.topUpButton = page.getByRole('button', { name: 'doładuj telefon' });
    this.readyLocator = this.balance;
  }

  /** Fill and execute the quick transfer widget, then close the dialog. */
  async makeQuickTransfer({ receiver, amount, title }: QuickTransfer) {
    await this.transferReceiver.selectOption(receiver);
    await this.transferAmount.fill(amount);
    await this.transferTitle.fill(title);
    await this.transferButton.click();
    await this.closeConfirmationDialog();
  }

  /** Fill and execute the phone top up widget, then close the dialog. */
  async topUpPhone({ phoneNumber, amount }: PhoneTopUp) {
    await this.topUpReceiver.selectOption(phoneNumber);
    await this.topUpAmount.fill(amount);
    await this.topUpAgreement.click();
    await this.topUpButton.click();
    await this.closeConfirmationDialog();
  }

  /** Current account balance as a number. */
  async getBalance(): Promise<number> {
    return Number(await this.balance.innerText());
  }

  /** Navigate to the payments screen. */
  async openPayments(): Promise<void> {
    await this.paymentsLink.click();
  }
}

export default DashboardPage;
