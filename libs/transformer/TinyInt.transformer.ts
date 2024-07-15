import { ValueTransformer } from "typeorm";

export class TinyIntTransformer implements ValueTransformer {
  to(entityValue: boolean): number {
    return entityValue ? 1 : 0;
  }

  from(databaseValue: number): boolean {
    return databaseValue === 1;
  }
}
