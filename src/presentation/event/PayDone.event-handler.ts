import { EventsHandler, IEventHandler } from "@nestjs/cqrs";

import { PayDoneEvent } from "../../domain/event/PayDone.event";

@EventsHandler(PayDoneEvent)
export class OrderCreatedHandler implements IEventHandler<PayDoneEvent> {
  handle(event: PayDoneEvent) {
    console.log("주문 번호 : " + event.orderId);
    console.log("주문자 : " + event.uuid);
    console.log("금액 : " + event.price);
    // 외부 API 호출
    return Promise.resolve();
  }
}
