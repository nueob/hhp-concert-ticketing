import { ValueTransformer } from "typeorm";

import { OrderStepEnum } from "../../../enum/OrderStep.enum";

export class OrderTicketStepTransformer implements ValueTransformer {
  to(entityValue: OrderStepEnum): string {
    return entityValue?.code;
  }

  from(databaseValue: string): OrderStepEnum {
    return OrderStepEnum.findByCode(databaseValue);
  }
}
