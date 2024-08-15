import { EventsHandler, IEventHandler } from "@nestjs/cqrs";

import { PayDoneEvent } from "../../domain/event/PayDone.event";
import { PayDoneMessageSender } from "../../domain/message/PayDone.message-sender";
import { PayDoneMessage } from "@root/domain/message/PayDone.message";
import { OutBoxService } from "@root/domain/service/OutBox.service";
import { OutBox } from "@root/domain/OutBox.domain";

@EventsHandler(PayDoneEvent)
export class OrderCreatedHandler implements IEventHandler<PayDoneEvent> {
  constructor(
    private readonly payDoneMessageSender: PayDoneMessageSender,
    private readonly outboxService: OutBoxService,
  ) {}

  async handle(event: PayDoneEvent) {
    console.log("outbox 번호: " + event.outBoxId);
    console.log("주문 번호 : " + event.orderId);
    console.log("주문자 : " + event.uuid);
    console.log("금액 : " + event.price);
    // 외부 API 호출
    await this.payDoneMessageSender.sendMessage(
      JSON.stringify(
        new PayDoneMessage(event.orderId, event.uuid, event.price),
      ),
    );

    await this.outboxService.changeFinish(event.outBoxId);
    return;
  }
}
