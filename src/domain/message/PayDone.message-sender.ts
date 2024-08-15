import { PayDoneMessage } from "./PayDone.message";

export interface PayDoneMessageSender {
  sendMessage(payDoneMessage: PayDoneMessage): Promise<void>;
}
