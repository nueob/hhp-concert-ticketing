import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { PayDoneMessageSender } from "@root/domain/message/PayDone.message-sender";

@Injectable()
export class PayDoneMessageSenderImpl implements PayDoneMessageSender {
  constructor(@Inject("PAY_DONE") private readonly kafkaClient: ClientKafka) {}

  sendMessage(payDoneMessage: string): Promise<void> {
    this.kafkaClient.emit("pay-done", JSON.stringify(payDoneMessage));
    return;
  }
}
