import { PayDoneEvent } from "./PayDone.event";

export interface PayDoneEventPublisher {
  triggerEvent(payDoneEvent: PayDoneEvent): Promise<void>;
}
