import { type PhoneTopUp, type QuickTransfer } from '../pages/dashboard.page';

/** Quick transfer widget - receiver option '2' is "Chuck Demobankowy". */
export const quickTransferData: QuickTransfer & { receiverName: string } = {
  receiver: '2',
  receiverName: 'Chuck Demobankowy',
  amount: '150',
  title: 'pizza',
};

/** Phone top up widget. */
export const phoneTopUpData: PhoneTopUp = {
  phoneNumber: '500 xxx xxx',
  amount: '50',
};
