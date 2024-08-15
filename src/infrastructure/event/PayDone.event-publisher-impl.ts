import { EventBus } from "@nestjs/cqrs";

import { PayDoneEvent } from "../../domain/event/PayDone.event";
import { PayDoneEventPublisher } from "../../domain/event/PayDone.event-publisher";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PayDoneEventPublisherImpl implements PayDoneEventPublisher {
  constructor(private readonly eventBus: EventBus) {}

  async triggerEvent(payDoneEvent: PayDoneEvent): Promise<void> {
    await this.eventBus.publish(payDoneEvent);

    return;
  }
}
