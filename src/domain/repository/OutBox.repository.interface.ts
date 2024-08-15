import { OutBox } from "../OutBox.domain";

export interface OutBoxRepositoryInterface {
  find(): Promise<OutBox[]>;
  findById(id: number): Promise<OutBox>;
  update(outBox: OutBox): Promise<void>;
  insert(outBox: OutBox): Promise<OutBox>;
}
