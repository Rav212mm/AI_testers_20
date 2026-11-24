import { type Locator, type Page } from '@playwright/test';
import { LoggedInPage } from './base.page';
import { PaymentsPage } from './payments.page';

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
export class DashboardPage extends LoggedInPage {
  // account state / navigation
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

  protected readonly readyLocator: Locator;

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
  async makeQuickTransfer({
    receiver,
    amount,
    title,
  }: QuickTransfer): Promise<void> {
    await this.transferReceiver.selectOption(receiver);
    await this.transferAmount.fill(amount);
    await this.transferTitle.fill(title);
    await this.transferButton.click();
    await this.closeConfirmationDialog();
  }

  /** Fill and execute the phone top up widget, then close the dialog. */
  async topUpPhone({ phoneNumber, amount }: PhoneTopUp): Promise<void> {
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

  /** Navigate to the payments screen and return it once it is rendered. */
  async openPayments(): Promise<PaymentsPage> {
    await this.paymentsLink.click();

    const paymentsPage = new PaymentsPage(this.page);
    await paymentsPage.waitUntilReady();
    return paymentsPage;
  }
}
