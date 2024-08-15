import { OutBox } from "../OutBox.domain";

export interface OutBoxRepositoryInterface {
  find(): Promise<OutBox[]>;
  insert(outBox: OutBox): Promise<OutBox>;
}
