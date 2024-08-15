import { OutBox } from "@root/domain/OutBox.domain";
import { OutBoxEntity } from "@root/infrastructure/entity/OutBox.entity";

export class OutBoxMapper {
  static mapToOutBoxDomain(entity: OutBoxEntity): OutBox {
    if (!entity) return;

    return new OutBox(
      entity.id,
      entity.topic,
      entity.message,
      entity.is_finish,
      entity.created_at,
    );
  }

  static mapToOutBoxEntity(domain: OutBox): OutBoxEntity {
    if (!domain) return;

    const outBoxEntity = new OutBoxEntity();
    outBoxEntity.id = domain.id;
    outBoxEntity.topic = domain.topic;
    outBoxEntity.message = domain.message;
    outBoxEntity.is_finish = domain.isFinish;
    outBoxEntity.created_at = domain.createdAt;

    return outBoxEntity;
  }
}
