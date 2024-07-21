import { ValueTransformer } from "typeorm";

import { WaitingQueueStatusEnum } from "../../src/enum/WaitingQueueStatus.enum";

export class WaitingQueueStatusTransformer implements ValueTransformer {
  to(entityValue: WaitingQueueStatusEnum): string {
    return entityValue?.code;
  }

  from(databaseValue: string): WaitingQueueStatusEnum {
    return WaitingQueueStatusEnum.findByCode(databaseValue);
  }
}
