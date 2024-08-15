import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { OutBoxRepositoryInterface } from "@root/domain/repository/OutBox.repository.interface";
import { OutBox } from "@root/domain/OutBox.domain";
import { OutBoxEntity } from "./entity/OutBox.entity";
import { OutBoxMapper } from "@root/mapper/OutBox.mapper";

@Injectable()
export class OutBoxRepositoryImpl implements OutBoxRepositoryInterface {
  constructor(
    @InjectRepository(OutBoxEntity)
    private readonly outBoxRepository: Repository<OutBoxEntity>,
  ) {}

  async find(): Promise<OutBox[]> {
    const outBoxList = await this.outBoxRepository.find();

    return outBoxList.map((outBox) => OutBoxMapper.mapToOutBoxDomain(outBox));
  }

  async insert(outBox: OutBox): Promise<OutBox> {
    const outBoxEntity = this.outBoxRepository.create(
      OutBoxMapper.mapToOutBoxEntity(outBox),
    );

    return OutBoxMapper.mapToOutBoxDomain(
      await this.outBoxRepository.save(outBoxEntity),
    );
  }
}
