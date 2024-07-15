import { ValueTransformer } from "typeorm";

import { PointTransactionTypeEnum } from "../../src/enum/PointTransactionType.enum";

export class PointTransactionTypeTransformer implements ValueTransformer {
  to(entityValue: PointTransactionTypeEnum): string {
    return entityValue?.code;
  }

  from(databaseValue: string): PointTransactionTypeEnum {
    return PointTransactionTypeEnum.findByCode(databaseValue);
  }
}
