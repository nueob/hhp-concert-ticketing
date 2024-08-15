import { Inject, Injectable } from "@nestjs/common";

import { OutBoxRepositoryInterface } from "../repository/OutBox.repository.interface";
import { OutBox } from "../OutBox.domain";

@Injectable()
export class OutBoxService {
  constructor(
    @Inject("OutBoxRepositoryInterface")
    private readonly outBoxRepositoryInterface: OutBoxRepositoryInterface,
  ) {}

  async insert(outBox: OutBox): Promise<OutBox> {
    return this.outBoxRepositoryInterface.insert(outBox);
  }

  async changeFinish(id: number): Promise<OutBox> {
    const outbox = await this.outBoxRepositoryInterface.findById(id);
    outbox.changeFinish();

    this.outBoxRepositoryInterface.update(outbox);
    return;
  }

  async findUnfinishedTasks(): Promise<OutBox[]> {
    const outboxList = await this.outBoxRepositoryInterface.find();

    return outboxList.filter((outbox) => !outbox.isFinish);
  }
}
