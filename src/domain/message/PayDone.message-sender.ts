export interface PayDoneMessageSender {
  sendMessage(payDoneMessage: string): Promise<void>;
}
