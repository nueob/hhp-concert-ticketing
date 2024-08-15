import { EventsHandler, IEventHandler } from "@nestjs/cqrs";

import { PayDoneEvent } from "../../domain/event/PayDone.event";
import { PayDoneMessageSender } from "../../domain/message/PayDone.message-sender";
import { PayDoneMessage } from "@root/domain/message/PayDone.message";

@EventsHandler(PayDoneEvent)
export class OrderCreatedHandler implements IEventHandler<PayDoneEvent> {
  constructor(private readonly payDoneMessageSender: PayDoneMessageSender) {}

  handle(event: PayDoneEvent) {
    console.log("주문 번호 : " + event.orderId);
    console.log("주문자 : " + event.uuid);
    console.log("금액 : " + event.price);
    // 외부 API 호출
    return this.payDoneMessageSender.sendMessage(
      JSON.stringify(
        new PayDoneMessage(event.orderId, event.uuid, event.price),
      ),
    );
  }
}
