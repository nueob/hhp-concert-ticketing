import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { PayDoneMessage } from "@root/domain/message/PayDone.message";
import { PayDoneMessageSender } from "@root/domain/message/PayDone.message-sender";

@Injectable()
export class PayDoneMessageSenderImpl implements PayDoneMessageSender {
  constructor(@Inject("PAY_DONE") private readonly kafkaClient: ClientKafka) {}

  sendMessage(payDoneMessage: PayDoneMessage): Promise<void> {
    this.kafkaClient.emit("pay-done", JSON.stringify(payDoneMessage));
    return;
  }
}
