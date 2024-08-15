import { OutBox } from "../OutBox.domain";

export interface OutBoxRepositoryInterface {
  insert(outBox: OutBox): Promise<OutBox>;
}
