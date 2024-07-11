import { Performance } from "./Performance.domain";

export class Concert {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _performanceList: Performance[];

  constructor(id?: number, name?: string, performanceList?: Performance[]) {
    this._id = id;
    this._name = name;
    this._performanceList = performanceList;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get performanceList(): Performance[] {
    return this._performanceList;
  }
}
